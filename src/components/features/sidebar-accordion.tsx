'use client'

/*
  This component requires the gsap package for animation.

  Usage:

  <SidebarAccordion>
    <SidebarAccordion>Item>
      <SidebarAccordionTrigger>Title</SidebarAccordionTrigger>
      <SidebarAccordionContent>
        This content will appear when clicked
      </SidebarAccordionContent>
    <SidebarAccordionItem>
  </SidebarAccordion>
*/


import gsap from "gsap"

import { useEffect, useRef } from "react"

import { Button } from "../ui/button"


const SidebarAccordion = ({children}: {children: React.ReactNode}) => {
  return (
    <ul role="menu" className='mt-5'>
      {children}
    </ul>
  )
}


const SidebarAccordionItem = ({children, key}: {key?: string, children: React.ReactNode}) => {
  const open = useRef(false)

  const saItemRef = useRef<HTMLLIElement | null>(null)

  const chevronRightId = "#chevron-right"
  const SAContentId = "#sa-content"

  // Event handler
  const handleClick = () => {
    // Get the SidebarAccordionContent component.
    const saContent = saItemRef.current?.children[1]
    // Content of the sidebar accordion content compoenent.
    const content = saContent?.children[0]
    const contentHeight = content?.getBoundingClientRect().height
    // console.log(saContent?.id)
    // console.log(contentHeight)


    if (!open.current) {
      gsap.to(chevronRightId, {rotate: 90})
      // Content expand.
      gsap.to(SAContentId, {height: contentHeight})

      open.current = true
    } 
    else {
      gsap.to(chevronRightId, {rotate: 0})
      // Content collapsed
      gsap.to(SAContentId, {height: 0})

      open.current = false
    }
  }

  // Make sure that the sidebar accordion trigger and content are the
  // only child components of Item component.
  useEffect(() => {
    // Get the SibebarAccordionItem children
    const children = saItemRef.current?.children
    console.log({children: children?.length})
    const childrenIDs = ["sa-content", "sa-trigger-icon"]
    let errorMessage = "SidebarAccordionItem: ";

    if (children && children?.length === 2) {
      for (let index = 0; index < children.length; index++) {
        const element = children[index];
        console.log(element.id)
        if (!childrenIDs.includes(element.id)) {
          errorMessage += "Make sure to use the sidebar accordion trigger and content "
          errorMessage += "as only the children components. See Usage"
          throw new SyntaxError(errorMessage)
        }
      }
    }
    else if (children && children?.length > 2) {
      errorMessage += "Must use the sidebar accordion trigger and content "
      errorMessage += "as the only children components. See Usage."
      throw new SyntaxError(errorMessage)
    }
    else {
      errorMessage += "Must use the sidebar accordion trigger or content components. See Usage."
      throw new SyntaxError(errorMessage)
    }
    
  }, [])


  return (
    <li
      role="menu-item"
      ref={saItemRef}
      key={key}
      onClick={handleClick}
      className=""
    >
      {children}
    </li>
  )
}

const SidebarAccordionTrigger = ({children}: {children: React.ReactNode}) => {
  return (
    <ChevronRight>
      {children}
    </ChevronRight>
  )
}

const SidebarAccordionContent = ({children}: {children: React.ReactNode}) => {
  return (
    <div 
      id="sa-content"
      role="content"
      aria-orientation="vertical"
      className="overflow-hidden h-0 border w-max"
    >
      <div>
        {children}
      </div>
    </div>
  )
}

const ChevronRight = ({children}: {children: React.ReactNode}) => {
  return (
    <Button
      id="sa-trigger-icon"
      variant={"ghost"}
      role="trigger"
    >
      <svg id="chevron-right" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-chevron-right ">
        <path d="m9 18 6-6-6-6"/>
      </svg>
      <div>
        {children}
      </div>
    </Button>     
  )
}

export {
  SidebarAccordion,
  SidebarAccordionItem,
  SidebarAccordionTrigger,
  SidebarAccordionContent
}

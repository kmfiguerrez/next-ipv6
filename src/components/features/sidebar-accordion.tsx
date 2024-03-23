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

import React, { useEffect, useRef } from "react"

import { Button } from "../ui/button"


const SidebarAccordion = ({children}: {children: React.ReactNode}) => {
  return (
    <ul role="menu" className='flex flex-col mt-5'>
      {children}
    </ul>
  )
}


const SidebarAccordionItem = ({children, key}: {key: string, children: React.ReactNode}) => {
  const open = useRef(false)

  // Used in useEffect.
  const saItemRef = useRef<HTMLLIElement | null>(null)


  // Event handler
  const handleClick = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    
    // console.log(saContent?.id)
    // console.log(contentHeight)
    const selectedChevronIcon = e.currentTarget.children[0].children[0]
    // Get the selected SidebarAccordionContent component.
    const Content = e.currentTarget.children[1]
    const theContentHeight = Content.children[0].getBoundingClientRect().height

    console.log({target: selectedChevronIcon, content: Content})


    // Animations
    // Temporarily set the IDs.
    selectedChevronIcon.id = "thisIcon"
    Content.id = "thisContent"
    if (!open.current) {
      
      gsap.to("#thisIcon", {rotate: 90})
      // Content expand.
      gsap.to("#thisContent", {height: theContentHeight})

      open.current = true
    } 
    else {
      gsap.to("#thisIcon", {rotate: 0})
      // Content collapsed
      gsap.to("#thisContent", {height: 0})

      open.current = false
    }

    // Reset the IDs.
    selectedChevronIcon.id = ""
    Content.id = ""
  }


  // Make sure that the sidebar accordion trigger and content are the
  // only child components of Item component.
  useEffect(() => {
    // Get the SibebarAccordionItem children
    const children = saItemRef.current?.children

    let errorMessage = "SidebarAccordionItem: ";

    // Make use the sidebar accordion components are use right based on
    // the usage.
    if (children && children?.length === 2) {
      for (let index = 0; index < children.length; index++) {
        const element = children[index];

        // Must be use in the correct order.
        if (index === 0 && !element.classList.contains("sa-trigger")) {
          errorMessage += "Trigger and Content components must be use in the correct order. See Usage."
          throw new SyntaxError(errorMessage)
        }

        if (index === 2 && !element.classList.contains("sa-content")) {
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
      role="content"
      aria-orientation="vertical"
      className="sa-content overflow-hidden h-0 border"
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
      variant={"ghost"}
      role="trigger"
      className="sa-trigger"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round" 
        className="lucide lucide-chevron-right"
      >
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

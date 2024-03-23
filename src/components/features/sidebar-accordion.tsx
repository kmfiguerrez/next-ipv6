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
    <ul className='mt-5'>
      {children}
    </ul>
  )
}


const SidebarAccordionItem = ({children, key}: {key?: string, children: React.ReactNode}) => {
  const open = useRef(false)

  const saItemRef = useRef<HTMLLIElement | null>(null)

  const chevronRightId = "#chevron-right"
  const SAContentId = "#sidebar-accordion-content"



  return (
    <li 
      ref={saItemRef}
      key={key}
      onClick={() => {
        // Get the SidebarAccordionContent component.
        const saContent = saItemRef.current?.children[1]
        // Content of the sidebar accordion content compoenent.
        const content = saContent?.children[0]
        const contentHeight = content?.getBoundingClientRect().height
        console.log(saContent?.id)
        console.log(contentHeight)


        if (!open.current) {
          gsap.to(chevronRightId, {rotate: 90})
          // Content expand.
          gsap.to(SAContentId, {height: contentHeight})
          // gsap.fromTo(SAContentId, {height: 0}, {height: contentHeight})

          open.current = true
        } 
        else {
          gsap.to(chevronRightId, {rotate: 0})
          // Content collapsed
          gsap.to(SAContentId, {height: 0})

          open.current = false
        }
      }}
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
    <div id="sidebar-accordion-content" className="overflow-hidden h-0 border">
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

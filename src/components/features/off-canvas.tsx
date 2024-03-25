import React from 'react'

import { Button } from '../ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import FeaturesDialog from './features-dialog'

import { 
  SidebarAccordion, 
  SidebarAccordionContent, 
  SidebarAccordionItem, 
  SidebarAccordionTrigger
} from './sidebar-accordion'
import UtilitiesContent from './utilities/utilities-content'


type OffCanvasProps = {
  children: React.ReactNode
}


const OffCanvas: React.FC<OffCanvasProps> = ({ children }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side={'left'}>
        <SheetHeader>
          <SheetTitle>Features</SheetTitle>
          {/* <SheetDescription>
            This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
          </SheetDescription> */}
        </SheetHeader>
        
        {/* Features list */}
        <div>
        <SidebarAccordion className='mt-5'>
          
          <SidebarAccordionItem key='item-1'>
            <SidebarAccordionTrigger>Test</SidebarAccordionTrigger>
            <SidebarAccordionContent>
              <p>poop</p>
            </SidebarAccordionContent>
          </SidebarAccordionItem>

          <SidebarAccordionItem key='item-2'>
            <SidebarAccordionTrigger>Utilities</SidebarAccordionTrigger>
            <SidebarAccordionContent className='ps-7'>
              <UtilitiesContent />
            </SidebarAccordionContent>
          </SidebarAccordionItem>

        </SidebarAccordion>

        </div>
      </SheetContent>
    </Sheet>
  )
}

export default OffCanvas
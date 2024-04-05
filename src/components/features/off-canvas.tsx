import React from 'react'

import { Separator } from "@/components/ui/separator"

import UtilitiesContent from './utilities/utilities-content'
import ConversionContent from './conversion/conversion-content'
import ValidationContent from './validation/validation-content'
import GeneratorContent from './generator/generator-content'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { 
  SidebarAccordion, 
  SidebarAccordionContent, 
  SidebarAccordionItem, 
  SidebarAccordionTrigger
} from './sidebar-accordion'



type OffCanvasProps = {
  children: React.ReactNode
}


const OffCanvas: React.FC<OffCanvasProps> = ({ children }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side={'left'}>
        <SheetHeader>
          <SheetTitle className='text-left'>Features</SheetTitle>
          {/* <SheetDescription>
            This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
          </SheetDescription> */}
        </SheetHeader>
        
        <Separator />

        {/* Features list */}
        <SidebarAccordion className='mt-5'>
          
          <SidebarAccordionItem key='item-1'>
            <SidebarAccordionTrigger className='font-semibold'>Conversion</SidebarAccordionTrigger>
            <SidebarAccordionContent className='ps-7'>
              <ConversionContent />
            </SidebarAccordionContent>
          </SidebarAccordionItem>

          <SidebarAccordionItem key='item-2'>
            <SidebarAccordionTrigger className='font-semibold'>Validation</SidebarAccordionTrigger>
            <SidebarAccordionContent className='ps-7'>
              <ValidationContent />
            </SidebarAccordionContent>
          </SidebarAccordionItem>

          <SidebarAccordionItem key='item-2'>
            <SidebarAccordionTrigger className='font-semibold'>Generator</SidebarAccordionTrigger>
            <SidebarAccordionContent className='ps-7'>
              <GeneratorContent />
            </SidebarAccordionContent>
          </SidebarAccordionItem>               

          <SidebarAccordionItem key='item-2'>
            <SidebarAccordionTrigger className='font-semibold'>Utilities</SidebarAccordionTrigger>
            <SidebarAccordionContent className='ps-7'>
              <UtilitiesContent />
            </SidebarAccordionContent>
          </SidebarAccordionItem>

        </SidebarAccordion>
      </SheetContent>
    </Sheet>
  )
}

export default OffCanvas
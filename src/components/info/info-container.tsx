import React from 'react'

import { AboutFeaturesContent, AboutOutputContent, HowToUseContent, IntroContent } from './info-content'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


const InfoContainer = () => {
  return (
    <div>
      <h2 className='text-center text-4xl mb-8'>IPv6 Subnetting Program</h2>

      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className='text-lg'>What's this app is about?</AccordionTrigger>
          <AccordionContent>
            <IntroContent />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger className='text-lg'>How to use this app?</AccordionTrigger>
          <AccordionContent>
            <HowToUseContent />
          </AccordionContent>
        </AccordionItem>      

        <AccordionItem value="item-3">
          <AccordionTrigger className='text-lg'>About the output?</AccordionTrigger>
          <AccordionContent>
            <AboutOutputContent />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger className='text-lg'>About the features?</AccordionTrigger>
          <AccordionContent>
            <AboutFeaturesContent />
          </AccordionContent>
        </AccordionItem>                  
      </Accordion>

    </div>
  )
}

export default InfoContainer
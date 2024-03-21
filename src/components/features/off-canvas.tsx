import React from 'react'

import FeaturesDialog from './features-dialog'

import { Button } from '../ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"


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
        <div>
          <h3>Utilities</h3>
          <ul className='list-inside border ps-1'>

            <li>
              <FeaturesDialog 
                title='Expand'
                description='This action will expand abbreviated IPv6 addresss.'
                feature={{category: "utilities", operation: "expand"}}
              >
                <Button
                  variant={'ghost'}
                  size={'sm'}
                >
                  Expand
                </Button>
              </FeaturesDialog>
            </li>
            
            <li>
              <FeaturesDialog 
                title='Abbreviate'
                description='This action will abbreviate IPv6 addresss.'
                feature={{category: "utilities", operation: "abbreviate"}}
              >
                <Button
                  variant={'ghost'}
                  size={'sm'}
                >
                  Abbreviate
                </Button>
              </FeaturesDialog>
            </li>
            
          </ul>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default OffCanvas
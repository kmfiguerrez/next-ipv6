import React from 'react'

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
          <SheetDescription>
            This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
          </SheetDescription>
        </SheetHeader>
        <div>
          yo
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default OffCanvas
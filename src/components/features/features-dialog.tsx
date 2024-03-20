import React from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type Utilities = {
  category: "utilities"
  operation: "expand" | "abbreviate"
}



type Feature = Utilities


type FeaturesDialogProps = {
  children: React.ReactNode
  title: string
  feature: Feature
}

const FeaturesDialog: React.FC<FeaturesDialogProps> = ({ children, title, feature }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <div>
          {feature.operation}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default FeaturesDialog
import React from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import UtilitiesForm from './utilities/utilities-form'

type Utilities = {
  category: "utilities"
  operation: "expand" | "abbreviate"
}



type Feature = Utilities


type FeaturesDialogProps = {
  children: React.ReactNode
  title: string
  feature: Feature
  description: string
}

const FeaturesDialog: React.FC<FeaturesDialogProps> = ({ children, title, feature, description }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <div>
          {/* Form here */}
          {feature.category === 'utilities' &&
            <UtilitiesForm 
              operation={title.toLowerCase() === "expand" ? "Expand" : "Abbreviate"} 
            />
          }
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default FeaturesDialog
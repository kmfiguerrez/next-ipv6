import React from 'react'

import UtilitiesForm from './utilities/utilities-form'

import BinToHexForm from './conversion/bin-to-hex-form'
import DecToBinForm from './conversion/dec-to-bin-form'
import HexToDecForm from './conversion/hex-to-dec-form'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"



type TUtilities = {
  category: "utilities"
  operation: "expand" | "abbreviate"
}

type TConversion = {
  category: "conversion"
  operation: "convert"
  action: "BinToHex" | "DecToBin" | "HexToDec"
}

type TFeature = TUtilities | TConversion


type FeaturesDialogProps = {
  children: React.ReactNode
  title: string
  feature: TFeature
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

          {feature.category === "conversion" && feature.action === "BinToHex" &&
            <BinToHexForm
              operation='Convert'
            />            
          }

          {feature.category === "conversion" && feature.action === "DecToBin" &&
            <DecToBinForm
              operation='Convert'
            />            
          }

          {feature.category === "conversion" && feature.action === "HexToDec" &&
            <HexToDecForm
              operation='Convert'
            />            
          }                  
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default FeaturesDialog
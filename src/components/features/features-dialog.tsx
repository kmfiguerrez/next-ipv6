import React from 'react'

import UtilitiesForm from './utilities/utilities-form'

import BinToHexForm from './conversion/bin-to-hex-form'
import DecToBinForm from './conversion/dec-to-bin-form'
import HexToDecForm from './conversion/hex-to-dec-form'
import ValidationForm, { type TValidationActions } from './validation/validation-form'
import GeneratorForm, { type TGeneratorActions } from './generator/generator-form'

import { Separator } from "@/components/ui/separator"

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
}

type TValidation = {
  category: "validation"
  action?: TValidationActions
}

type TConversion = {
  category: "conversion"
  action?: "BinToHex" | "DecToBin" | "HexToDec"
}

type TGenerator = {
  category: "generator"
  action?: TGeneratorActions
}

type TFeature = TUtilities | TValidation | TGenerator | TConversion


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
      <DialogContent className='dark:bg-zinc-900'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>

        <Separator orientation='horizontal' className=''/>

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

          {feature.category === "validation" && feature.action === "validate-maca" &&
            <ValidationForm
              operation='Validate'
              action={"validate-maca"}
            />            
          }

          {feature.category === "validation" && feature.action === "validate-ipv6" &&
            <ValidationForm
              operation='Validate'
              action={"validate-ipv6"}
            />            
          }   

          {feature.category === "generator" && feature.action === "eui64" &&
            <GeneratorForm
              operation='Generate'
              action={"eui64"}
            />            
          }                   

        </div>
      </DialogContent>
    </Dialog>
  )
}

export default FeaturesDialog
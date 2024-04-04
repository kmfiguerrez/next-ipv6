import React from 'react'

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { inconsolata } from '@/lib/fonts'
import { cn } from '@/lib/utils'


type TFeaturesOutputBoxProps = {
  label: string
  className?: string
  result?: string
  formError?: string
}


const FeaturesOutputBox: React.FC<TFeaturesOutputBoxProps> = ({ label, formError, className, result }) => {
  let value: string = ""
  let success: boolean = false

  if (result && !formError) {
    // Display data.
    value = result

    // Show border and message.
    success = true
  }



  return (
    <div className={cn(``, className)}>
      <Label htmlFor="featuresOutputBox">
        {label}
      </Label>
      <Input 
        readOnly 
        id='featuresOutputBox'
        type="text" 
        placeholder="Result displays here"
        value={value}
        className={cn(`${inconsolata.className} mt-2 text-base`, 
          {"border-green-500/50": success} 
        )}
      />
      {/* Input validation message */}
      {success &&
        <div className='text-green-500 text-sm mt-1'>Success</div>
      }
    </div>
  )
}

export default FeaturesOutputBox
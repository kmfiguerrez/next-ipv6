import React, { useState } from 'react'

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { inconsolata } from '@/lib/fonts'
import { cn } from '@/lib/utils'


type FeaturesOutputBoxProps = {
  className?: string
  result: string | undefined
}


const FeaturesOutputBox: React.FC<FeaturesOutputBoxProps> = ({ className, result }) => {

  return (
    <div>
      <Label htmlFor="output-box">
        Output
      </Label>
      <Input 
        readOnly 
        id='output-box' 
        type="text" 
        placeholder="Result displays here"
        value={result ? result : ""}
        className={cn(`${inconsolata.className} mt-2 text-base`, 
          {"border-green-500": result} 
        )}
      />

      {/* <div id='output-box' className={`${inconsolata.className} border rounded-md h-10 py-2 px-3`}>
        <p className='slashed-zero'>0000:0aO</p>
      </div> */}

      {/* Input validation message */}
      {result &&
        <p className='text-green-500 text-sm mt-1'>Success</p>
      }
    </div>
  )
}

export default FeaturesOutputBox
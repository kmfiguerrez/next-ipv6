import React, { useRef, useState } from 'react'

import { Button } from "@/components/ui/button"

import FeaturesOutputBox from '@/components/features/features-output-box'

import IPv6 from "@/lib/ipv6"

import { ArrowRightLeft } from 'lucide-react'

import { getErrorMessage } from '@/lib/error-message'
import FromInputTag from './conversion-input-tag'


type TConversionFormProps = {
  operation: string
}


const BinToHexForm: React.FC<TConversionFormProps> = ({ operation }) => {
  const [inputValue, setInputValue] = useState<string>()
  const [error, setError] = useState<string>()
  const [output, setOutput] = useState<string>()
  const [action, setAction] = useState<"BinToHex" | "HexToBin">("BinToHex")


  const inputRef = useRef<HTMLInputElement>(null)

  // Event handlers.
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Reset error first.
    setError(undefined)

    let hexadecimals = inputValue as string
    let binaries = inputValue as string

    try {
      // Determine what action to perform.
      if (action === "HexToBin") {
        binaries = IPv6.toBinary({hexadecimals: hexadecimals, includeLeadingZeroes: false})
        setOutput(binaries)
        return
      }
      // Otherwise Binary to Hexadecimals.
      hexadecimals = IPv6.toHex({binaries: binaries, includeLeadingZeroes: false})
      setOutput(hexadecimals)
    } 
    catch (error: unknown) {
      let errorMessage: string = getErrorMessage(error)
      if (errorMessage.startsWith("From toBinary")) {
        errorMessage = "Invalid hexadecimals"
      }
      else {
        // Otherwise starts with: From toHex
        errorMessage = "Invalid binaries"
      }
      setError(errorMessage)

      // Focus on erroring input tag.
      inputRef.current?.focus()
    }    
  }

  const handleSwitch = () => {
    // Reset output and errors and input value first.
    setOutput(undefined)
    setError(undefined)
    setInputValue(undefined)

    if (action === "HexToBin") {
      setAction("BinToHex")
      return
    }
    // Otherwise
    setAction("HexToBin")
  }
  
  
  return (
    <form onSubmit={handleSubmit}>

      {/* Input tag */}
      {action === "BinToHex" ? (
          <FromInputTag
            ref={inputRef}
            label='Binary'
            placeholder='Enter binaries here'
            onChange={setInputValue}
            formMessage={error}
            value={inputValue}
          />
        ) : (

          <FromInputTag
            ref={inputRef}
            label='Hexadecimals'
            placeholder='Enter hexadecimals here'
            onChange={setInputValue}
            formMessage={error}
            value={inputValue}
          />          
        )
      }

      {/* Switch button */}
      <Button
        type='button'
        variant={"ghost"} 
        size={"icon"}
        onClick={handleSwitch}
        className='mb-4'
      >
        <ArrowRightLeft />
      </Button>

      {/* Output */}
      <FeaturesOutputBox
        label={action === "BinToHex" ? "Hexadecimals" : "Binary"}
        formError={error}
        result={output}
        className='mb-8'
      />      

      <Button type="submit">
        {operation}
      </Button>      
    </form>
  )
}


export default BinToHexForm
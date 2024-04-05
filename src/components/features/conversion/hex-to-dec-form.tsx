import React, { useRef, useState } from 'react'

import { Button } from "@/components/ui/button"

import FeaturesOutputBox from '@/components/features/shared/features-output-box'

import IPv6 from "@/lib/ipv6"

import { ArrowRightLeft } from 'lucide-react'

import { getErrorMessage } from '@/lib/error-message'
import FromInputTag from '../shared/features-input-tag'

import { ArgumentError } from '@/lib/custom-error'


type TConversionFormProps = {
  operation: string
}


const HexToDecForm: React.FC<TConversionFormProps> = ({ operation }) => {
  const [inputValue, setInputValue] = useState<string>()
  const [error, setError] = useState<string>()
  const [output, setOutput] = useState<string>()
  const [action, setAction] = useState<"HexToDec" | "DecToHex">("HexToDec")

  const inputRef = useRef<HTMLInputElement>(null)

  // Event handlers.
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Reset error first.
    setError(undefined)

    let hexadecimals: string = inputValue ? inputValue : ""
    let decimals: number = parseInt(inputValue as string)
    
    let bigInteger: bigint

    try {
      // Determine what action to perform.
      if (action === "HexToDec") {
        // Validate input hexadecimals first.
        if (!IPv6.isHex(hexadecimals)) throw new ArgumentError("Invalid hexadecimals.")

        decimals = parseInt(hexadecimals, 16)
        if (decimals >= Number.MAX_SAFE_INTEGER) {
          bigInteger = IPv6.toBigIntDecimal(hexadecimals, 16)
          setOutput(bigInteger.toString())
          return
        }
        // Otherwise hexadecimals is less than safe integers.
        decimals = IPv6.toDecimal(hexadecimals, 16)
        setOutput(decimals.toString())
        return
      }

      // Otherwise action is decimals to hexadecimals .
      // Validate input decimal first.
      if (isNaN(decimals) || (inputValue as string).includes(".") || !IPv6.isDecimal(inputValue as string)) {
        throw new ArgumentError("Invalid integers.")
      }

      if (decimals >= Number.MAX_SAFE_INTEGER) {
        // Passed decimals as string to avoid losing precision.
        bigInteger = BigInt(inputValue as string)
        hexadecimals = IPv6.toHex(bigInteger)
        setOutput(hexadecimals)
        return
      }
      // Otherwise decimals is less than safe integers.
      hexadecimals = IPv6.toHex(decimals)
      setOutput(hexadecimals)
    }
    catch (error: unknown) {
      let errorMessage: string = getErrorMessage(error)
      if (errorMessage.startsWith("From toDecimal") || errorMessage.startsWith("Invalid hexadecimals")) {
        errorMessage = "Invalid hexadecimals"
      }
      else {
        // Otherwise starts with: From toHex
        errorMessage = "Invalid integers"
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

    if (action === "HexToDec") {
      setAction("DecToHex")
      return
    }
    // Otherwise
    setAction("HexToDec")
  }


  return (
    <form onSubmit={handleSubmit}>

      {/* Input tag */}
      {action === "HexToDec" ? (
        <FromInputTag
          ref={inputRef}
          formMessage={error}
          label='Hexadecimal'
          placeholder='Enter hexadecimals here'
          onChange={setInputValue}
          value={inputValue}
        />
      ) : (
        <FromInputTag
          ref={inputRef}
          formMessage={error}
          label='Decimal'
          placeholder='Enter integers here'
          onChange={setInputValue}
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
        label={action === "HexToDec" ? "Decimal" : "Hexadecimal"}
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


export default HexToDecForm
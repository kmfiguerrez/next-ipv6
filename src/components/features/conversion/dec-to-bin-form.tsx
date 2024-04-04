import React, { useRef, useState } from 'react'

import { Button } from "@/components/ui/button"

import FeaturesOutputBox from '@/components/features/features-output-box'

import IPv6 from "@/lib/ipv6"

import { ArrowRightLeft } from 'lucide-react'

import { getErrorMessage } from '@/lib/error-message'
import FromInputTag from './conversion-input-tag'

import { ArgumentError } from '@/lib/custom-error'


type TConversionFormProps = {
  operation: string
}


const DecToBinForm: React.FC<TConversionFormProps> = ({ operation }) => {
  const [inputValue, setInputValue] = useState<string>()
  const [error, setError] = useState<string>()
  const [output, setOutput] = useState<string>()
  const [action, setAction] = useState<"DecToBin" | "BinToDec">("DecToBin")


  const inputRef = useRef<HTMLInputElement>(null)

  // Event handlers.
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Reset error first.
    setError(undefined)

    let decimals: number = parseInt(inputValue as string)
    let binaries = inputValue as string

    let bigInteger: bigint

    try {
      // Determine what action to perform.
      if (action === "DecToBin") {
        // Validate input decimal first.
        if (isNaN(decimals)) throw new ArgumentError("Invalid integers.")

        if (decimals >= Number.MAX_SAFE_INTEGER) {
          bigInteger = BigInt(inputValue as string)
          binaries = IPv6.toBinary(bigInteger)
          setOutput(binaries)
          return
        }
        // Otherwise decimals is less than safe integers.
        binaries = IPv6.toBinary(decimals)
        setOutput(binaries)
        return
      }

      // Otherwise action is Binary to decimals.
      if (decimals >= Number.MAX_SAFE_INTEGER) {
        bigInteger = IPv6.toBigIntDecimal(binaries, 2)
        setOutput(bigInteger.toString())
        return
      }
      // Otherwise binary is less than safe integers.
      decimals = IPv6.toDecimal(binaries, 2)
      setOutput(decimals.toString())
    }
    catch (error: unknown) {
      let errorMessage: string = getErrorMessage(error)
      if (errorMessage.startsWith("From toBinary") || errorMessage.startsWith("Invalid integers")) {
        errorMessage = "Invalid integers"
      }
      else {
        // Otherwise starts with: From toDecimal
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

    if (action === "DecToBin") {
      setAction("BinToDec")
      return
    }
    // Otherwise
    setAction("DecToBin")
  }


  return (
    <form onSubmit={handleSubmit}>

      {/* Input tag */}
      {action === "DecToBin" ? (
        <FromInputTag
          ref={inputRef}
          label='Decimal'
          placeholder='Enter integers here'
          onChange={setInputValue}
          formMessage={error}
          value={inputValue}
        />
      ) : (
        <FromInputTag
          ref={inputRef}
          label='Binary'
          placeholder='Enter binaries here'
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
        label={action === "DecToBin" ? "Binary" : "Decimal"}
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


export default DecToBinForm
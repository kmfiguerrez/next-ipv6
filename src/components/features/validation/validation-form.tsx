import React, { useRef, useState } from 'react'

import FeaturesOutputBox from '@/components/features/shared/features-output-box'
import FromInputTag from '@/components/features/shared/features-input-tag'

import { Button } from '@/components/ui/button'

import IPv6 from '@/lib/ipv6'

import gsap from 'gsap'


type TValidationFormProps = {
  operation: string
  action: "validate-maca" | "validate-ipv6"
}

const ValidationForm: React.FC<TValidationFormProps> = ({ operation, action }) => {
  const [inputValue, setInputValue] = useState<string>()
  const [error, setError] = useState<string>()
  const [output, setOutput] = useState<string>()
  
  const inputRef = useRef<HTMLInputElement>(null)
  // Used for animation.
  const inputPrevValue = useRef<string>("initial value") 
  
  // Event handler.
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Reset error first.
    setError(undefined)

    let isValid: boolean

    // Determine what action to perform.
    switch (action) {
      case "validate-maca": {
        const macAddress = inputValue ? inputValue : ""
        isValid = IPv6.isValidMacAddress(macAddress)
        if (!isValid) {
          setError("Invalid MAC Address.")
          return
        }
        // Otherwise valid.
        setOutput("Valid MAC Address")

        /*
          Animation.
          If the input value is the same don't animate.
        */
        if (macAddress !== inputPrevValue.current) {
          gsap.fromTo("#featuresOutputBox", {opacity: 0}, {opacity: 1, duration: .1})
          gsap.fromTo("#featuresOutputBoxMessage", {opacity: 0}, {opacity: 1, duration: .1})
        }
        
        // Set current input value as previous value.
        inputPrevValue.current = macAddress

        return
      }
      case "validate-ipv6": {
        const ipv6Address = inputValue ? inputValue : ""
        isValid = IPv6.isValidIpv6(ipv6Address)
        if (!isValid) {
          setError("Invalid IPv6 Address.")
          return
        }
        // Otherwise valid.
        setOutput("Valid IPv6 Address")

        /*
          Animation.
          If the input value is the same don't animate.
        */
          if (ipv6Address !== inputPrevValue.current) {
            gsap.fromTo("#featuresOutputBox", {opacity: 0}, {opacity: 1, duration: .1})
            gsap.fromTo("#featuresOutputBoxMessage", {opacity: 0}, {opacity: 1, duration: .1})
          }
          
        // Set current input value as previous value.
        inputPrevValue.current = ipv6Address

        return        
      }
      default: {
        console.error("Could not determine validation action!")
        break;
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {action === "validate-maca" &&
        <FromInputTag
          ref={inputRef}
          label='MAC Address'
          placeholder='Enter MAC address here'
          onChange={setInputValue}
          formMessage={error}
          value={inputValue}
        />
      }

      {action === "validate-ipv6" &&
        <FromInputTag
          ref={inputRef}
          label='IPv6 Address'
          placeholder='Enter IPv6 address here'
          onChange={setInputValue}
          formMessage={error}
          value={inputValue}
        />
      }      

      {/* Output */}
      <FeaturesOutputBox
        label={"Output"}
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

export default ValidationForm
import React, { useRef, useState } from 'react'

import FeaturesOutputBox from '@/components/features/shared/features-output-box'
import FromInputTag from '@/components/features/shared/features-input-tag'

import { Button } from '@/components/ui/button'

import IPv6 from '@/lib/ipv6'

import gsap from 'gsap'


export type TValidationActions = "validate-maca" | "validate-ipv6" | "get-type"

type TValidationFormProps = {
  operation: string
  action: TValidationActions
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
    const ipv6Address = inputValue ? inputValue : ""

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
      case "get-type": {
        isValid = IPv6.isValidIpv6(ipv6Address)
        if (!isValid) {
          setError("Invalid IPv6 Address.")
          return
        }
        // Otherwise valid, get the address type.
        const addressType = IPv6.getAddressType(ipv6Address, true)
        setOutput(addressType)

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
          className='mb-8'
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
          className='mb-8'
        />
      }

      {action === "get-type" &&
        <FromInputTag
          ref={inputRef}
          label='IPv6 Address'
          placeholder='Enter IPv6 address here'
          onChange={setInputValue}
          formMessage={error}
          value={inputValue}
          className='mb-8'
        />
      }         

      {/* Output */}
      <FeaturesOutputBox
        label={"Output"}
        formError={error}
        result={output}
        className='mb-8'
      />

      <div className='flex justify-between'>
        <Button type="submit">
          {action === "get-type" ? "Get type" : operation}
        </Button>

        {/* Link to iana.
            This link shows up only when action is get-type.
        */}
        {action === "get-type" &&
          <Button 
            variant={"link"}
            asChild
          >
            <a 
              href="https://www.iana.org/assignments/ipv6-address-space/ipv6-address-space.xhtml" 
              target="_blank" 
              rel="noopener noreferrer"
              className='text-sky-500'
            >
              source
            </a>
          </Button>
        }
      </div>
    </form>
  )
}

export default ValidationForm
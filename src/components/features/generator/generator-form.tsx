import React, { useRef, useState } from 'react'

import FeaturesOutputBox from '@/components/features/shared/features-output-box'
import FromInputTag from '@/components/features/shared/features-input-tag'

import { Button } from '@/components/ui/button'

import IPv6 from '@/lib/ipv6'

import gsap from 'gsap'

import { getErrorMessage } from '@/lib/error-message'


export type TGeneratorActions = "eui64" | "link-local" | "socilited-node"

type TGeneratorFormProps = {
  operation: string
  action: TGeneratorActions
}


const GeneratorForm: React.FC<TGeneratorFormProps> = ({ operation, action}) => {
  const [inputValue, setInputValue] = useState<string>()
  const [error, setError] = useState<string>()
  const [output, setOutput] = useState<string>()
  
  const inputRef = useRef<HTMLInputElement>(null)
  // Used for animation.
  const inputPrevValue = useRef<string>("initial value")

  // Set output label.
  let outputLabel: string
  switch (action) {
    case "eui64": {
      outputLabel = "Interface ID"
      break;
    }
    case "link-local": {
      outputLabel = "Link-Local Unicast Address"
      break;
    }    
    default:
      outputLabel = "Output"
      break;
  }


  
  // Event handler.
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Reset error first.
    setError(undefined)

    const macAddress: string = inputValue ? inputValue : ""

    try {
      // Determine what action to perform.
      switch (action) {
        case "eui64": {
          const interfaceID: string = IPv6.eui64(macAddress)
          setOutput(interfaceID.toUpperCase())

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
        case "link-local": {
          const linkLocalAddress = IPv6.getLinkLocalAddress(macAddress)
          setOutput(linkLocalAddress.toUpperCase())

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
        default:
          console.error("Could not determine generator's action!")
          break;
      }
    } 
    catch (error: unknown) {
      const errorMessage = getErrorMessage(error)
      if (errorMessage.startsWith("From eui64") || errorMessage.startsWith("From getLinkLocalAddress")) {
        setError("Invalid MAC addrress")
        return
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {action === "eui64" &&
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

      {action === "link-local" &&
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

      {action === "socilited-node" &&
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
        label={outputLabel}
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

export default GeneratorForm
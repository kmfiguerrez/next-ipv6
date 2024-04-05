import React, { useRef, useState } from 'react'

import FeaturesOutputBox from '@/components/features/shared/features-output-box'
import FromInputTag from '@/components/features/shared/features-input-tag'

import { Button } from '@/components/ui/button'

import IPv6 from '@/lib/ipv6'

import gsap from 'gsap'

import { getErrorMessage } from '@/lib/error-message'


type TGeneratorFormProps = {
  operation: string
  action: "eui64" | "link-local" | "socilited-node"
}


const GeneratorForm: React.FC<TGeneratorFormProps> = ({ operation, action}) => {
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

    try {
      // Determine what action to perform.
      switch (action) {
        case "eui64": {
          const macAddress: string = inputValue ? inputValue : ""
          const interfaceID: string = IPv6.eui64(macAddress)
          setOutput(interfaceID)

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
      if (errorMessage.startsWith("From eui64")) {
        setError("Invalid MAC addrress")
        return
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {action === "eui64" || action === "link-local" &&
        <FromInputTag
          ref={inputRef}
          label='MAC Address'
          placeholder='Enter MAC address here'
          onChange={setInputValue}
          formMessage={error}
          value={inputValue}
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

export default GeneratorForm
import React, { useRef, useState } from 'react'

import FeaturesOutputBox from '@/components/features/shared/features-output-box'
import FromInputTag from '@/components/features/shared/features-input-tag'

import { Button } from '@/components/ui/button'


type TValidationFormProps = {
  operation: string
}

const ValidationForm: React.FC<TValidationFormProps> = ({ operation }) => {
  const [inputValue, setInputValue] = useState<string>()
  const [error, setError] = useState<string>()
  const [output, setOutput] = useState<string>()
  const [action, setAction] = useState<"DecToBin" | "BinToDec">("DecToBin")
  
  const inputRef = useRef<HTMLInputElement>(null)
  
  // Event handler.
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

  }

  return (
    <form>
      <FromInputTag
        ref={inputRef}
        label='Decimal'
        placeholder='Enter integers here'
        onChange={setInputValue}
        formMessage={error}
        value={inputValue}
      />

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

export default ValidationForm
import React, { forwardRef } from 'react'

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

import { cn } from '@/lib/utils'

import { inconsolata } from '@/lib/fonts'


/**
 * @property `formMessage` is used for error message.
 */
type TFromInputTagProps = {
  label: string
  placeholder?: string
  onChange: React.Dispatch<React.SetStateAction<string | undefined>>
  formMessage?: string
  value?: string
}

const FromInputTag = forwardRef<HTMLInputElement, TFromInputTagProps>(function FromInputTag(props, ref) {
  const {label, placeholder, onChange, formMessage, value} = props

  return (
    <div className='flex flex-col mb-4'>
      <Label
        htmlFor="convertion-from"
        className={cn(`mb-4`, { "text-red-500": formMessage })}
      >
        {label}
      </Label>
      <Input
        id='convertion-from'
        ref={ref}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        value={value ? value : ""}
        className={`${inconsolata.className} text-lg`}
      />
      {formMessage &&
        <div
          className={`text-red-500 mt-1`}
        >
          {formMessage}
        </div>
      }
    </div>
  )
})

export default FromInputTag
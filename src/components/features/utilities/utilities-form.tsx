'use client'


import React, { useState } from 'react'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import utilitiesFormSchema, { type TutilitiesForm } from "@/schemas/utilities-form-schema"

import IPv6, { type IPv6ReturnData } from "@/lib/ipv6"

import FeaturesOutputBox from '../features-output-box'

import { inconsolata } from '@/lib/fonts'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"


type UtilitiesFormProps = {
  operation: string
}

const UtilitiesForm: React.FC<UtilitiesFormProps> = ({ operation }) => {
  const [output, setOutput] = useState<IPv6ReturnData>()

  // 1. Define your form.
  const form = useForm<TutilitiesForm>({
    resolver: zodResolver(utilitiesFormSchema),
    defaultValues: {
      ipv6Address: "",
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: TutilitiesForm) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    
    let result: IPv6ReturnData

    if (operation.toLowerCase() === "expand") {
      result = IPv6.expand(values.ipv6Address)
      setOutput(result)
    }
    else {
      result = IPv6.abbreviate(values.ipv6Address)
      setOutput(result)
    }
  }
  console.log({Output: output})
  
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

        {/* Input */}
        <FormField
          control={form.control}
          name="ipv6Address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>IPv6 Address</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter IPv6 Address here" 
                  {...field} 
                  className={`${inconsolata.className} text-base`} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Output */}
        <FeaturesOutputBox result={output}/>

        <Button 
          type="submit"
          onClick={() => setOutput(undefined)}
        >
          {operation}
        </Button>

      </form>
    </Form>
  )
}

export default UtilitiesForm
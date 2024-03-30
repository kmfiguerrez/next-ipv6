'use client'

import { Dispatch, SetStateAction, useRef } from "react"
import { createPortal } from 'react-dom';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import ipv6FormSchema, { type Tipv6Form } from '@/schemas/ipv6-form-schema'
import IPv6, { type TPrefix, type TPrefixData } from "@/lib/ipv6"

import { inconsolata } from "@/lib/fonts"

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


type TIPv6FormProps = {
  onFormSubmit: Dispatch<SetStateAction<TPrefix | undefined>>
}

const IPv6SubnettingForm: React.FC<TIPv6FormProps> = ({ onFormSubmit }) => {
  // 1. Define your form.
  const form = useForm<Tipv6Form>({
    resolver: zodResolver(ipv6FormSchema),
    defaultValues: {
      ipv6Address: "",
      prefixLength: "",
      subnetBits: "",
      subnetNumber: "0"
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: Tipv6Form) {
    // Do something with the form values.
    const ipv6Address = values.ipv6Address;
    const prefixLength = parseInt(values.prefixLength)
    const subnetBits = parseInt(values.subnetBits)
    const subnetNumber = values.subnetNumber

    // Get prefix.
    const getPrefixResult: TPrefixData = IPv6.getPrefix(ipv6Address, prefixLength, subnetBits, subnetNumber)
    
    // Check for field error.
    if (getPrefixResult.errorFields.length > 0) {
      console.log("There's error.")
      getPrefixResult.errorFields.map(paramError => {
        // Set errors.
        if (paramError.field.toLowerCase() === "ipv6address") {
          form.setError("ipv6Address", {type: "value", message: paramError.message})
        }
        if (paramError.field.toLowerCase() === "prefixlength") {
          form.setError("prefixLength", {type: "value", message: paramError.message})
        }
        if (paramError.field.toLowerCase() === "subnetbits") {
          form.setError("subnetBits", {type: "value", message: paramError.message})
        }
        if (paramError.field.toLowerCase() === "subnettofind") {
          form.setError("subnetNumber", {type: "value", message: paramError.message})
        }        
      })
      // Exit.
      return
    }
    // Otherwise no error.
    console.log(getPrefixResult.data)
    onFormSubmit(getPrefixResult.data)
  }
  
  const formRef = useRef<HTMLFormElement | null>(null)

  return (
    <Form {...form}>
      <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mb-10">

        <FormField
          control={form.control}
          name="ipv6Address"
          render={({ field }) => (
            <FormItem>
              <FormLabel >IPv6 Address</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter IPv6 Address here" 
                  {...field}
                  className={`${inconsolata.className} text-lg`}
                />
              </FormControl>
              <FormMessage className=""/>
            </FormItem>
          )}
        />

        <div className="grid gap-x-5 grid-cols-2">
          <FormField
            control={form.control}
            name="prefixLength"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prefix length</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    min={0}
                    max={128}
                    placeholder="Enter Prefix length here" 
                    {...field}
                    className={`${inconsolata.className} text-lg`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />        

          <FormField
            control={form.control}
            name="subnetBits"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subnet bits</FormLabel>
                <FormControl>
                  <Input 
                  type="number"
                  min={0}
                  max={128}
                  placeholder="Enter Subnet bits here" 
                  {...field}
                  className={`${inconsolata.className} text-lg`}
                />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Teleport this input element in the output component.
            If there's no error after submitting, Portal works
            because first, all elements have already committed
            so referencing elements works like document.querySelector.
        */}
        {form.formState.isSubmitted && createPortal(
          <FormField
            control={form.control}
            name="subnetNumber"
            render={({ field }) => (
              <FormItem className="flex space-y-0">
                <FormLabel className="font-semibold self-center text-base">Subnet: </FormLabel>
                <FormControl>
                  <Input 
                  type="number"
                  min={0}
                  max={128}
                  placeholder="Enter Subnet bits here" 
                  {...field}
                  className={`${inconsolata.className} w-[50%] h-7`}
                />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />,
          // formRef.current?.nextElementSibling as Element
          document.querySelector("#subnetNumberContainer") as Element
        )}

        <Button 
          type="submit"
          disabled={!form.formState.isValid}
        >
          Subnet
        </Button>

      </form>
    </Form>
  )
}

export default IPv6SubnettingForm
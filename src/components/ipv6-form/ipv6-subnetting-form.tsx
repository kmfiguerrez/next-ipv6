'use client'

import React, { Dispatch, SetStateAction, useRef } from "react"
import { createPortal } from 'react-dom';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import gsap from "gsap"

import ipv6FormSchema, { type Tipv6Form } from '@/schemas/ipv6-form-schema'
import IPv6, { type TPrefix, type TPrefixData } from "@/lib/ipv6"

import FormError from "./form-error";

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

type TPrefixPrevValue = {
  ipv6Address: string
  prefixLength: number
  subnetBits: number
  subnetNumber: bigint
}

const IPv6SubnettingForm: React.FC<TIPv6FormProps> = ({ onFormSubmit }) => {
  const [formError, setFormError] = React.useState<string>()
  // Used for animation.
  const prefixPreviousValue = useRef<TPrefixPrevValue>({
    ipv6Address: "",
    prefixLength: -1,
    subnetBits: -1,
    subnetNumber: BigInt(-1)
  })


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
    // Reset error first.
    setFormError(undefined)

    // Do something with the form values.
    const ipv6Address: string = values.ipv6Address;
    const prefixLength: number = parseInt(values.prefixLength)
    const subnetBits: number = parseInt(values.subnetBits)
    const subnetNumber: bigint = BigInt(values.subnetNumber)

    /*
      Before getting the prefix, check first if the current input values
      are the same thing as the previous values. If they are then don't
      even bother getting the prefix data.
    */
    if (sameValues(ipv6Address, prefixLength, subnetBits, subnetNumber)) {
      // Exit out of the submit handler immediately.
      return
    }
    // Get prefix.
    const getPrefixResult: TPrefixData = IPv6.getPrefix(ipv6Address, prefixLength, subnetBits, subnetNumber)
    
    // Check for field error.
    if (getPrefixResult.errorFields.length > 0) {
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
          // Get the error for subnet number.
          setFormError(paramError.message)
        }
      })
      // Exit.
      return
    }
    // Otherwise no error.
    onFormSubmit(getPrefixResult.data)

    // Animation.
    // const tl = gsap.timeline()
    // tl.fromTo("#prefixId", {opacity: 0}, {opacity: 1, duration: .1})
    // tl.fromTo("#firstUsableAddress", {opacity: 0}, {opacity: 1, duration: .1})
    // tl.fromTo("#lastUsableAddress", {opacity: 0}, {opacity: 1, duration: .1})

    // Animate subnet number change.
    if (prefixPreviousValue.current.subnetNumber !== BigInt(subnetNumber)) {
      gsap.fromTo("#prefixId", {opacity: 0}, {opacity: 1, duration: .1})
      gsap.fromTo("#firstUsableAddress", {opacity: 0}, {opacity: 1, duration: .1})
      gsap.fromTo("#lastUsableAddress", {opacity: 0}, {opacity: 1, duration: .1})
    }

    // Set the current value as previous value.
    prefixPreviousValue.current.ipv6Address = ipv6Address
    prefixPreviousValue.current.prefixLength = getPrefixResult.data!.networkPortionBin.length
    prefixPreviousValue.current.subnetBits = subnetBits
    prefixPreviousValue.current.subnetNumber = getPrefixResult.data!.subnetNumber
  }

  const sameValues = (ipv6Address: string, prefixLength: number, subnetBits: number, subnetNumber: bigint ): boolean => {
    if (ipv6Address === prefixPreviousValue.current.ipv6Address 
      && prefixLength === prefixPreviousValue.current.prefixLength
      && subnetBits === prefixPreviousValue.current.subnetBits
      && subnetNumber === prefixPreviousValue.current.subnetNumber
    ) {
      console.log("Same value. Exiting the submit handler immediately.")
      return true
    }
    // Otherwise return false.
    return false
  }
  
  /*
    Show only the portal input element for subnet number
    if the state isSubmitSuccessful has been set to true.
  */
  const show = useRef<boolean>(false)
  if (form.formState.isSubmitSuccessful) show.current = true

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mb-10">

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
                  className={`${inconsolata.className} text-lg border-black/50`}
                />
              </FormControl>
              <FormMessage className=""/>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-y-8 md:gap-x-5 md:grid-cols-2">
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
                    className={`${inconsolata.className} text-lg border-black/50`}
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
                  className={`${inconsolata.className} text-lg border-black/50`}
                />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Teleport this input element and form error component 
            into the output component.
            If there's no error after submitting at least once, Portal works
            because first, one of the code branch of the output component
            (if prefix is not undefined) have comitted, so referencing 
            elements works like document.querySelector("subnetNumber").
        */}
        {show.current && createPortal(
          <FormField
            control={form.control}
            name="subnetNumber"
            render={({ field }) => (
              <FormItem className="flex space-y-0">
                <FormLabel className="font-semibold self-center text-base">Subnet: </FormLabel>
                <FormControl>
                  <Input
                  id="subnetNumberInput"
                  type="number"
                  min={0}
                  max={128}
                  placeholder="" 
                  {...field}
                  className={`${inconsolata.className} w-[50%] h-7 bg-transparent border-0 text-lg`}
                />
                </FormControl>
                {/* <FormMessage /> */}
              </FormItem>
            )}
          />,
          document.querySelector("#subnetNumberContainer") as Element
        )}
        {show.current && createPortal(
          <FormError message={formError} className='mb-7'/>,
          document.querySelector("#output-error") as Element
        )}        

        <Button 
          type="submit"
          disabled={!form.formState.isValid}
          className="max-sm:w-full "
        >
          Subnet
        </Button>

      </form>
    </Form>
  )
}

export default IPv6SubnettingForm
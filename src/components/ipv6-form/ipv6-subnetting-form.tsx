'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import ipv6FormSchema, { type Tipv6Form } from '@/schemas/ipv6-form-schema'
import IPv6, { type TPrefixData } from "@/lib/ipv6"

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




const Ipv6SubnettingForm = () => {
  // 1. Define your form.
  const form = useForm<Tipv6Form>({
    resolver: zodResolver(ipv6FormSchema),
    defaultValues: {
      ipv6Address: "",
      prefixLength: "",
      subnetBits: "",
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: Tipv6Form) {
    // Do something with the form values.
    const ipv6Address = values.ipv6Address;
    const prefixLength = parseInt(values.prefixLength)
    const subnetBits = parseInt(values.subnetBits)

    // Get prefix.
    const getPrefixResult: TPrefixData = IPv6.getPrefix(ipv6Address, prefixLength, subnetBits)
    
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
      })
      // Exit.
      return
    }

    // Otherwise no error.
    console.log(getPrefixResult.data)
  }
  
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

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

        <Button type="submit">Subnet</Button>

      </form>
    </Form>
  )
}

export default Ipv6SubnettingForm
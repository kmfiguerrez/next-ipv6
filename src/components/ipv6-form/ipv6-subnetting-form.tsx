'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import ipv6FormSchema, { type Tipv6Form } from '@/schemas/ipv6-form-schema'
import IPv6, { TPrefix, TPrefixData } from "@/lib/ipv6"

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
    // ✅ This will be type-safe and validated.
    const ipv6Address = values.ipv6Address;
    const prefixLength = parseInt(values.prefixLength)
    const subnetBits = parseInt(values.subnetBits)

    // form.setError("ipv6Address", {type: "value", message: "test lang"})
    const prefix: TPrefixData = IPv6.getPrefix(ipv6Address, prefixLength, subnetBits)
    console.log("Status:", prefix.success)
    console.log("Error:", prefix.error)
    console.log((prefix.data as TPrefix))

  }
  
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

        <FormField
          control={form.control}
          name="ipv6Address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>IPv6 Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter IPv6 Address here" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
              />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />   

        <Button type="submit">Submit</Button>

      </form>
    </Form>
  )
}

export default Ipv6SubnettingForm
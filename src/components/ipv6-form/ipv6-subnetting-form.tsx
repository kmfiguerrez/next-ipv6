'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import ipv6FormSchema, { type Tipv6Form } from '@/schemas/ipv6-form-schema'
import { IPv6 } from "@/lib/ipv6"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormDescription,
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
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: Tipv6Form) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // const expandedIPv6 = IPv6.expand(values.ipv6Address)
    const abbreviatedIPv6 = IPv6.abbreviate(values.ipv6Address)

    // console.log("Expanded: ", expandedIPv6)
    console.log("Abbreviated: ", abbreviatedIPv6)

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
              <FormDescription>
                This is your public display name.
              </FormDescription>
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
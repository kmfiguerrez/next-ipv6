'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import utilitiesFormSchema, { type TutilitiesForm } from "@/schemas/utilities-form-schema"

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

const UtilitiesForm = () => {
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
    // const expandedIPv6 = IPv6.expand(values.ipv6Address)
    // const abbreviatedIPv6 = IPv6.abbreviate(values.ipv6Address)

    // console.log("Expanded: ", expandedIPv6)
    // console.log("Abbreviated: ", abbreviatedIPv6)
    console.log(IPv6.isHex(values.ipv6Address)) 
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

export default UtilitiesForm
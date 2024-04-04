import { z } from "zod"

const ipv6FormSchema = z.object({
  ipv6Address: z
    .string()
    .refine((value) => {
      if (value.length === 0) return false

      return true
    },
    { message: "IPv6 Address is required" }),
  prefixLength: z
    .string()
    .refine((value) => {
      if (value.length === 0) return false

      return true
    },
    { message: "Prefix length is required" }),
  subnetBits: z
    .string()
    .refine((value) => {
      if (value.length === 0) return false

      return true
    },
    { message: "Subnet bits is required" }),
  subnetNumber: z.string()
})
.strict()

type Tipv6Form = z.infer<typeof ipv6FormSchema>

export default ipv6FormSchema
export type { Tipv6Form }
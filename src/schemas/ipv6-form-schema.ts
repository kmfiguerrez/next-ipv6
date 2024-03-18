import { IPv6 } from "@/lib/ipv6"
import { z } from "zod"

const ipv6FormSchema = z.object({
  ipv6Address: z
    .string()
    .refine((value) => {
      if (IPv6.isValidIpv6(value) === false) return false

      return true
    },
    { message: "Invalid IPv6 Address" })
})

type Tipv6Form = z.infer<typeof ipv6FormSchema>

export default ipv6FormSchema
export type { Tipv6Form }
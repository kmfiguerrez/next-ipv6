import IPv6 from "@/lib/ipv6"
import { z } from "zod"

const utilitiesFormSchema = z.object({
  ipv6Address: z
    .string()
    .refine((value) => {
      if (IPv6.isValidIpv6(value) === false) return false

      return true
    },
    { message: "Invalid IPv6 Address" })
})

type TutilitiesForm = z.infer<typeof utilitiesFormSchema>

export default utilitiesFormSchema
export type { TutilitiesForm }
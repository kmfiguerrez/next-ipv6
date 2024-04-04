import IPv6 from "@/lib/ipv6"
import { z } from "zod"

const utilitiesFormSchema = z.object({
  ipv6Address: z
    .string()
    // .refine((value) => {
    //   if (value.length === 0) return false

    //   return true
    // },
    // { message: "Invalid IPv6 Address" })
})

type TutilitiesForm = z.infer<typeof utilitiesFormSchema>

export default utilitiesFormSchema
export type { TutilitiesForm }
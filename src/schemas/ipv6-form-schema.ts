import { z } from "zod"

const ipv6FormSchema = z.object({
    ipv6Address: z.string()
})

type Tipv6Form = z.infer<typeof ipv6FormSchema>

export default ipv6FormSchema
export type {Tipv6Form}
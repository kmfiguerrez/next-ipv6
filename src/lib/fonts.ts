import { Montserrat, Inconsolata } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"] })
const inconsolata = Inconsolata({ 
  subsets: ['latin'],
  // display: 'swap',
  // variable: '--font-inconsolata'
})

export {
  montserrat,
  inconsolata
}
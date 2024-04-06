import React from 'react'

import Link from 'next/link'

import { Button } from "@/components/ui/button"

import { cn } from '@/lib/utils'

type TFooterNavProps = {
  className?: string
}


const FooterNav: React.FC<TFooterNavProps> = ({ className }) => {
  return (
    <footer className={cn(`max-sm:px-1 flex flex-col space-y-1 sm:container`, className)}>
      <FooterNavLinks />
      <span className='text-center text-sm'>&copy; IPv6 Subnetting 2024 | All Rights Reserved.</span>
    </footer>
  )
}



const FooterNavLinks = () => {
  return (
    <nav className='mb-1'>
      <ul className='flex justify-center'>
        <li>
          <Button
            variant={"link"}
            size={'sm'}
          >
            <Link href="/#nav-header">Home</Link>
          </Button>
        </li>
        <li>
          <Button
            variant={"link"}
            size={'sm'}
            asChild
          >
            <a href="https://www.linkedin.com/in/kmfiguerrez/" target="_blank" rel="noopener noreferrer">
              Contact
            </a>
          </Button>          
        </li>
        <li>
          <Button
            variant={"link"}
            size={'sm'}
            asChild
          >
            <a href="https://www.paypal.com/paypalme/kmfiguerrez" target="_blank" rel="noopener noreferrer">
              Donate
            </a>
          </Button>          
        </li>
      </ul>
    </nav>
  )
}

export default FooterNav
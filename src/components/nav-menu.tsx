import { useState } from "react"

import { Button } from "@/components/ui/button"

import OffCanvas from "./features/off-canvas"

import { ModeToggle } from "./theme-color/theme-toggler"

import { cn } from "@/lib/utils"

import { Menu, X } from "lucide-react"

import gsap from "gsap"



const NavMenu = () => {
  return (
    <header className="mb-5 mt-1 max-sm:px-1 sm:container">
      <nav className='flex justify-between '>
        
        <h1 className="flex items-center font-semibold text-lg uppercase">IPv6 Subnetting</h1>

        <ModeToggle />

        <NavLinks className="max-sm:hidden sm:flex sm:flex-row"/>
        {/* Mobile links */}
        <NavDropDownTrigger className="sm:hidden"/>

      </nav>
      {/* Nav dropdown content */}
      <NavDropdownContent>
        <NavLinks />
      </NavDropdownContent>
    </header>
  )
}


const NavDropdownContent = ({children}: {children: React.ReactNode}) => {
  return (
    <div id="navDropdownContent" className="h-0 overflow-hidden">
      {children}
    </div>
  )
}

const NavLinks = ({className}: {className?: string}) => {
  return (
    <ul className={cn(``, className)}>
      <li>
        <OffCanvas>
          <Button
            variant={"link"}
          >
            Features
          </Button>
        </OffCanvas>        
      </li>

      <li>
      <Button
        variant={"link"}
      >
        Info
      </Button>
      </li>      
    </ul>
  )
}

const NavDropDownTrigger = ({className}: {className?: string}) => {
  const [state, setState] = useState<"open" | "close">("close")

  const handleClick = () => {
    if (state === "close") {
      setState("open")

      // Get the nav dropdown content container.
      const navDropdownContent = document.getElementById("navDropdownContent")
      const navLinksElem = navDropdownContent?.children[0]
      const navLinksHeight = navLinksElem?.getBoundingClientRect().height

      // Animation.
      gsap.to("#navDropdownContent", {height: navLinksHeight})
      return
    }
    // Otherwise state is open.
    setState("close")
    // Animation.
    gsap.to("#navDropdownContent", {height: 0})
  }

  return (
    <Button
      variant={"outline"}
      size={"icon"}
      onClick={handleClick}
      className={cn(``, className)}
    >
      {state === "close" ? (
          <Menu />
        ): (
          <X />
        )
      }
    </Button>
  )
}

export default NavMenu
import { Button } from "@/components/ui/button"

import OffCanvas from "./off-canvas"

import { ModeToggle } from "./theme-color/theme-toggler"


const NavMenu = () => {
  return (
    <header className="container mb-5 mt-1">
      <nav className='flex justify-between '>
        
        <h1 className="flex items-center">IPv6 Subnetting</h1>

        <ModeToggle />

        <div>
          <OffCanvas>
            <Button
              variant={"link"}
            >
              Features
            </Button>
          </OffCanvas>

          <Button
            variant={"link"}
          >
            Info
          </Button>
        </div>

      </nav>
    </header>
  )
}

export default NavMenu
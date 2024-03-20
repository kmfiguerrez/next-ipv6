import { Button } from "@/components/ui/button"


const NavMenu = () => {
  return (
    <header className="container">
      <nav className='flex justify-between'>
        
        <h1>IPv6 Subnetting</h1>

        <div>
          <Button
            variant={"link"}
          >
            Features
          </Button>

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
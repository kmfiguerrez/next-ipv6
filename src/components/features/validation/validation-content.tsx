import { Button } from '@/components/ui/button'

import FeaturesDialog from '@/components/features/features-dialog'



const ValidationContent = () => {
  return (
    <ul>
      <li>
        <FeaturesDialog
          title='Validation'
          description='This action validates MAC address.'
          feature={{category: "validation", action:"validate-maca"}}
        >
          <Button
            variant={'ghost'}
            size={'sm'}
          >
            MAC Address Format
          </Button>
        </FeaturesDialog>
      </li>

      <li>
        <FeaturesDialog
          title='Validation'
          description='This action validates IPv6 address.'
          feature={{category: "validation", action:"validate-ipv6"}}
        >
          <Button
            variant={'ghost'}
            size={'sm'}
          >
            IPv6 Address Format
          </Button>
        </FeaturesDialog>
      </li>

      <li>
        <FeaturesDialog
          title='Validation'
          description='This action determines the type of IPv6 address.'
          feature={{category: "validation", action:"get-type"}}
        >
          <Button
            variant={'ghost'}
            size={'sm'}
          >
            IPv6 Address Type
          </Button>
        </FeaturesDialog>
      </li>           
    </ul>
  )
}

export default ValidationContent
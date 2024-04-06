import { Button } from '@/components/ui/button'

import FeaturesDialog from '@/components/features/features-dialog'

const GeneratorContent = () => {
  return (
    <ul>
      <li>
        <FeaturesDialog
          title='Generator'
          description='This action generates the Interface ID portion of IPv6 Address.'
          feature={{category: "generator", action:"eui64"}}
        >
          <Button
            variant={'ghost'}
            size={'sm'}
          >
            Interface ID
          </Button>
        </FeaturesDialog>
      </li>

      <li>
        <FeaturesDialog
          title='Generator'
          description='This action generates a Unicast Link-Local IPv6 Address.'
          feature={{category: "generator", action:"link-local"}}
        >
          <Button
            variant={'ghost'}
            size={'sm'}
          >
            Link-Local Address
          </Button>
        </FeaturesDialog>
      </li>  

      <li>
        <FeaturesDialog
          title='Generator'
          description='This action generates a Solicited-Node Multicast IPv6 Address.'
          feature={{category: "generator", action:"socilited-node"}}
        >
          <Button
            variant={'ghost'}
            size={'sm'}
          >
            Solicited-Node Address
          </Button>
        </FeaturesDialog>
      </li>          
    </ul>
  )
}

export default GeneratorContent
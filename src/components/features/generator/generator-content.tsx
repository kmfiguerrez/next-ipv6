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
    </ul>
  )
}

export default GeneratorContent
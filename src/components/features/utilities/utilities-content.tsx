import { Button } from '@/components/ui/button'

import FeaturesDialog from '@/components/features/features-dialog'


const UtilitiesContent = () => {
  return (
    <ul className=''>
      <li>
        <FeaturesDialog 
          title='Expand'
          description='This action will expand abbreviated IPv6 addresss.'
          feature={{category: "utilities"}}
        >
          <Button
            variant={'ghost'}
            size={'sm'}
          >
            Expand
          </Button>
        </FeaturesDialog>
      </li>
      
      <li>
        <FeaturesDialog 
          title='Abbreviate'
          description='This action will abbreviate IPv6 addresss.'
          feature={{category: "utilities"}}
        >
          <Button
            variant={'ghost'}
            size={'sm'}
          >
            Abbreviate
          </Button>
        </FeaturesDialog>
      </li>
    </ul>
  )
}

export default UtilitiesContent
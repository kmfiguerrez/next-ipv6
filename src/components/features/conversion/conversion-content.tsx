import React from 'react'

import { Button } from '@/components/ui/button'

import FeaturesDialog from '@/components/features/features-dialog'

const ConversionContent = () => {
  return (
    <ul>
      <li>
        <FeaturesDialog
          title='Conversion'
          description='This action will convert hexadecimals to binary and vice versa.'
          feature={{category: "conversion", operation: "convert", action: "BinToHex"}}
        >
          <Button
            variant={'ghost'}
            size={'sm'}
          >
            Bin To Hex
          </Button>
        </FeaturesDialog>
      </li>

    </ul>
  )
}

export default ConversionContent
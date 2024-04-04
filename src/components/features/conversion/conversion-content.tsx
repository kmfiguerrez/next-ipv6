import React from 'react'

import { Button } from '@/components/ui/button'

import FeaturesDialog from '@/components/features/features-dialog'

const ConversionContent = () => {
  return (
    <ul>
      <li>
        <FeaturesDialog
          title='Conversion'
          description='This action converts hexadecimals to binary and vice versa.'
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

      <li>
        <FeaturesDialog
          title='Conversion'
          description='This action converts decimals to binary and vice versa.'
          feature={{category: "conversion", operation: "convert", action: "DecToBin"}}
        >
          <Button
            variant={'ghost'}
            size={'sm'}
          >
            Dec To Bin
          </Button>
        </FeaturesDialog>
      </li>

      <li>
        <FeaturesDialog
          title='Conversion'
          description='This action converts Hexadecimals to decimals and vice versa.'
          feature={{category: "conversion", operation: "convert", action: "HexToDec"}}
        >
          <Button
            variant={'ghost'}
            size={'sm'}
          >
            Hex To Dec
          </Button>
        </FeaturesDialog>
      </li>      
    </ul>
  )
}

export default ConversionContent
import React from 'react'

import { Button } from '@/components/ui/button'

import FeaturesDialog from '@/components/features/features-dialog'

import { ArrowRightLeft } from 'lucide-react'



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
            <div className='flex items-center'>
              <span>Bin</span>
              <ArrowRightLeft className='h-4 w-4 ms-1 me-1' />
              <span>Hex</span>
            </div>
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
            <div className='flex items-center'>
              <span>Dec</span>
              <ArrowRightLeft className='h-4 w-4 ms-1 me-1' />
              <span>Bin</span>
            </div>
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
            <div className='flex items-center'>
              <span>Hex</span>
              <ArrowRightLeft className='h-4 w-4 ms-1 me-1' />
              <span>Dec</span>
            </div>
          </Button>
        </FeaturesDialog>
      </li>      
    </ul>
  )
}

export default ConversionContent
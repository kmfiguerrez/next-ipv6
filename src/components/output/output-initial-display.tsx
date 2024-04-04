import React from 'react'

import { Separator } from '../ui/separator'
import OutputTooltip from './output-tooltip'

const OutputInitialDisplay = () => {
  return (
    <div className='flex flex-col'>
      {/* Row 1 */}
      <div id='row-1' className='grid lg:grid-cols-3'>
        <div className='font-semibold'>
          <span>Subnet:</span>
          <span className='font-normal ms-2'>x</span>
        </div>
        <div className='font-semibold'>
          <OutputTooltip message='Number of subnets'>
            <span>Network</span>
          </OutputTooltip>
          <span className='text-sm font-light'>(s)</span>:
          <span className='font-normal ms-2'>x</span>
        </div>
        <div className='font-semibold'>
        <OutputTooltip message='Hosts per subnet'>
          <span>Hosts:</span>
        </OutputTooltip>
        <span className='font-normal ms-2'>x</span>
        </div>
      </div>

      <Separator className='mb-2 dark:bg-white/20'/>

      {/* Row 2 */}
      <div id='row-2' className='grid mb-2 lg:grid-cols-3'>
        <div className='font-semibold'>Prefix:</div>
        <div className={`border`}>
          xxxx : xxxx : xxxx : xxxx : xxxx : xxxx : xxxx : xxxx
        </div>
        <div className={`border`}>
        /x
        </div>
      </div>

      {/* Row 3 */}
      <div id='row-3' className='grid mb-2 lg:grid-cols-3'>
        <div className='font-semibold'>First Usable Address:</div>
        <div className={`border`}>
          xxxx : xxxx : xxxx : xxxx : xxxx : xxxx : xxxx : xxxx
        </div>
        <div className={`border`}>
        /x
        </div>
      </div>

      {/* Row 4 */}
      <div id='row-4' className='grid mb-2 lg:grid-cols-3'>
        <div className='font-semibold'>Last Usable Address:</div>
        <div className={`border`}>
          xxxx : xxxx : xxxx : xxxx : xxxx : xxxx : xxxx : xxxx
        </div>
        <div className={`border`}>
          /x
        </div>
      </div>
    </div>
  )
}

export default OutputInitialDisplay
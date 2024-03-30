import React from 'react'

import { Separator } from '../ui/separator'

const OutputInitialDisplay = () => {
  return (
    <div className='flex flex-col'>
      {/* Row 1 */}
      <div id='row-1' className='grid grid-cols-3'>
        <div className='font-semibold'>
          Subnet:
        </div>
        <div className='font-semibold'>
          Network<span className='text-sm font-light'>(s)</span>:
        </div>
        <div className='font-semibold'>
          Hosts:
        </div>
      </div>

      <Separator className='mb-2 dark:bg-white/20'/>

      {/* Row 2 */}
      <div id='row-2' className='grid grid-cols-3 mb-2'>
        <div className='font-semibold'>Prefix:</div>
        <div className={`border`}>
          xxxx : xxxx : xxxx : xxxx : xxxx : xxxx : xxxx : xxxx
        </div>
        <div className={`border`}>
        /x
        </div>
      </div>

      {/* Row 3 */}
      <div id='row-3' className='grid grid-cols-3 mb-2'>
        <div className='font-semibold'>First Usable Address:</div>
        <div className={`border`}>
          xxxx : xxxx : xxxx : xxxx : xxxx : xxxx : xxxx : xxxx
        </div>
        <div className={`border`}>
        /x
        </div>
      </div>

      {/* Row 4 */}
      <div id='row-4' className='grid grid-cols-3'>
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
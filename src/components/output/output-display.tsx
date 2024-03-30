import React from 'react'

import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import type { TPrefix } from '@/lib/ipv6'
import { inconsolata } from '@/lib/fonts'

import OutputInitialDisplay from './output-initial-display'


type TOutputDisplayProps = {
  className?: string
  prefix?: TPrefix 
}


const OutputDisplay: React.FC<TOutputDisplayProps> = ({prefix, className}) => {

  if (prefix === undefined) return <OutputInitialDisplay />

  const currentSubnetNumber: bigint = prefix.subnetNumber
  const subnetBits: number = prefix.subnetBits
  const numberOfNetworks: bigint = BigInt(2 ** subnetBits) - BigInt(1)
  const interfaceIdBits: number = prefix.interfaceIdPortion.bits
  const numberofHosts: bigint = BigInt(2 ** interfaceIdBits) - BigInt(1)
  const prefixId: string = prefix.id
  const firstUsableAddress: string = prefix.firstUsableAddress
  const lastUsableAddress: string = prefix.lastUsableAddresss
  const newPrefixLength: number = prefix.newPrefixLength

  // Format numbers
  const formattedNetworks = new Intl.NumberFormat("en-US").format(numberOfNetworks)
  const formattedHosts = new Intl.NumberFormat("en-US").format(numberofHosts)
                 

  return (
    <div className='flex flex-col'>
      {/* Row 1 */}
      <div id='row-1' className='grid grid-cols-3'>
        <div id='subnetNumberContainer' className='font-semibold'>
          {/* <div className='flex'>
            <Label htmlFor="subnetNumber-input" className='font-semibold self-center'>Subnet:</Label>
            <Input id="subnetNumber-input" className='w-[50%] h-8 bg-transparent border-0 font-normal'/>
          </div> */}
        </div>
        <div className='font-semibold'>
          Network<span className='text-sm font-light'>(s)</span>: 
          <span className={`${inconsolata.className} font-normal ms-2`}>
            {formattedNetworks}
          </span>
        </div>
        <div className='font-semibold'>
          Hosts:<span className={`${inconsolata.className} font-normal ms-2`}>{formattedHosts}</span>
        </div>
      </div>

      <Separator className='mb-2 dark:bg-white/20'/>

      {/* Row 2 */}
      <div id='row-2' className='grid grid-cols-3 mb-2'>
        <div className='font-semibold'>Prefix:</div>
        <div className={`${inconsolata.className} border`}>
          <span id='prefixId'>
            {prefixId}
          </span>
        </div>
        <div className={`${inconsolata.className} border`}>
          <span className='cidr'>
            /{newPrefixLength}
          </span>
        </div>
      </div>

      {/* Row 3 */}
      <div id='row-3' className='grid grid-cols-3 mb-2'>
        <div className='font-semibold'>First Usable Address:</div>
        <div className={`${inconsolata.className} border`}>
          <span id='firstUsableAddresss'>
            {firstUsableAddress}
          </span>
        </div>
        <div className={`${inconsolata.className} border`}>
          <span className='cidr'>
            /{newPrefixLength}
          </span>
        </div>
      </div>

      {/* Row 4 */}
      <div id='row-4' className='grid grid-cols-3'>
        <div className='font-semibold'>Last Usable Address:</div>
        <div className={`${inconsolata.className} border`}>
          <span id='lastUsableAddress'>
            {lastUsableAddress}
          </span>
        </div>
        <div className={`${inconsolata.className} border`}>
          <span className='cidr'>
            /{newPrefixLength}
          </span>
        </div>
      </div>
    </div>
  )
}

export default OutputDisplay
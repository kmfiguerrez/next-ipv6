import React, { useEffect } from 'react'

import { Separator } from "@/components/ui/separator"

import gsap from "gsap"

import type { TPrefix } from '@/lib/ipv6'
import { inconsolata } from '@/lib/fonts'

import OutputInitialDisplay from './output-initial-display'
import OutputTooltip from './output-tooltip'
import FormError from '../ipv6-form/form-error'

/**
 * @property `formError` is used to display subnet number error.
 */
type TOutputDisplayProps = {
  className?: string
  prefix?: TPrefix
}


const OutputDisplay: React.FC<TOutputDisplayProps> = ({ prefix }) => {

  // Code branching.
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
                 
  // Animation.
  useEffect(() => {
    setTimeout(() => {
      gsap.to("#subnetNumberInput", { outline: "3px solid Aquamarine", duration: 1, ease: "elastic" })
      gsap.to("#subnetNumberInput", { outline: "0px", duration: 1, delay: 1 })
      console.log("ayo!")
    }, 3000)
  }, [])

  return (
    <div className='flex flex-col'>

      {/* Form error show's up here. */}
      <div id='output-error'></div>

      {/* Row 1 */}
      <div id='row-1' className='grid grid-cols-3'>
        <div id='subnetNumberContainer' className='font-semibold'>
          {/* Input element for subnet number will show up here. */}
        </div>
        <div className='font-semibold'>
          <OutputTooltip message='Number of subnets'>
            <span>Network</span>
          </OutputTooltip>
          <span className='text-sm font-light'>(s)</span>: 
          <span className={`${inconsolata.className} font-normal ms-2`}>
            {formattedNetworks}
          </span>
        </div>
        <div className='font-semibold'>
          <OutputTooltip message='Hosts per subnet'>
            <span>Hosts:</span>
          </OutputTooltip>
          <span className={`${inconsolata.className} font-normal ms-2`}>{formattedHosts}</span>
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
          <span id='firstUsableAddress'>
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
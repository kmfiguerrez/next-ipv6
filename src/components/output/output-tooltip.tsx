import React from 'react'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type TOutputTooltipProps = {
  children: React.ReactNode  
  message: string
}


const OutputTooltip: React.FC<TOutputTooltipProps> = ({ children, message}) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          <p>{message}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default OutputTooltip
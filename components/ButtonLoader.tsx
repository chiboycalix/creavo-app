import { Loader2 } from 'lucide-react'
import React from 'react'

const ButtonLoader = ({ isLoading, caption = "Continue" }: { isLoading: boolean; caption: string; }) => {
  return (
    <>{
      isLoading ? <p className="flex items-center gap-2">
        <Loader2 className="animate-spin" /> Please wait...
      </p> : caption
    }</>
  )
}

export default ButtonLoader
import { Loader2 } from 'lucide-react'
import React from 'react'

const ButtonLoader = ({ isLoading, caption = "Continue" }: { isLoading: boolean; caption: string; }) => {
  return (
    <>{
      isLoading ? <p className="flex gap-2 items-center ">
        <Loader2 className="animate-spin" /> Please wait...
      </p> : caption
    }</>
  )
}

export default ButtonLoader
import React, { useState } from 'react'
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from './ui/button'

const SuccessDialog = ({ caption = "Save", successMessage, showSuccessDialog, setShowSuccessDialog }: { caption?: string, successMessage: string, showSuccessDialog: boolean; setShowSuccessDialog: any }) => {

  return (
    <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
      <DialogContent className="sm:max-w-[500px] px-0">
        <DialogHeader className="px-4">
          <DialogTitle className="mb-2"></DialogTitle>
          <DialogDescription className="text-xs">
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center">
          <img src={"/assets/success.png"} alt='success img' />
          <h2 className='my-4 text-xl font-semibold'>Success</h2>
          <p className='w-[80%] text-center'>{successMessage}</p>
        </div>
        <DialogFooter className="px-4 w-full">
          <Button className="w-full" onClick={() => setShowSuccessDialog(false)}>
            {caption}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default SuccessDialog
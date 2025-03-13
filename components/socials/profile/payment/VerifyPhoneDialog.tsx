"use client"
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { PhoneInput } from '@/components/Input/PhoneInput'

const VerifyPhoneDialog = ({ isVerifyPhoneDialogOpen, setIsVerifyPhoneDialogOpen, setIsVerifyOtpDialogOpen }: { isVerifyPhoneDialogOpen: boolean; setIsVerifyPhoneDialogOpen: any, setIsVerifyOtpDialogOpen: any }) => {
  const maxLength = 10;
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+234");

  const handleChange = (phone: string, code: string) => {
    setPhone(phone);
    setCountryCode(code);
  };

  return (
    <Dialog open={isVerifyPhoneDialogOpen} onOpenChange={setIsVerifyPhoneDialogOpen}>
      <DialogContent className="sm:max-w-[500px] px-0">
        <DialogHeader className="px-4">
          <DialogTitle className="mb-2">Verify Your Phone Number</DialogTitle>
          <DialogDescription className="text-xs">
            To complete adding your bank details, please enter your phone number. We&apos;ll send a verification code to ensure the security of your account.
          </DialogDescription>
        </DialogHeader>
        <div className="bg-primary-50">
          <hr />
          <div className="px-4 mt-4 mb-6">
            <PhoneInput
              label="Phone Number"
              value={phone}
              onChange={handleChange}
              placeholder="Phone No."
              errorMessage={phone.length > maxLength ? "Phone number too long" : false}
              maxLength={maxLength}
              className="bg-white"
              type="number"
            />
          </div>
          <hr />
        </div>
        <DialogFooter className="px-4">
          <Button type="submit" className="px-8" onClick={() => {
            setIsVerifyPhoneDialogOpen(false)
            setIsVerifyOtpDialogOpen(true)
          }}>Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default VerifyPhoneDialog
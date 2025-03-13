"use client"
import React, { FormEvent, useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { useAuth } from '@/context/AuthContext'
import { ChevronLeft } from 'lucide-react'
import SuccessDialog from '@/components/SuccessDialog'


const PaymentOtpDialog = ({ setIsVerifyOtpDialogOpen, isVerifyOtpDialogOpen, setShowSuccessDialog }: { isVerifyOtpDialogOpen: boolean; setIsVerifyOtpDialogOpen: any; setShowSuccessDialog: any }) => {
  const [alert, setAlert] = useState<string>("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(300);
  const [isResending, setIsResending] = useState(false)
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)
  const { setAuth } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsVerifyingOtp(true)
    try {

    } catch (error: any) {
      setAlert(String(error.message));
    } finally {
      setIsVerifyingOtp(false)
    }
  };

  const handleResendOtp = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsResending(true)
    try {

    } catch (error) {
      setAlert(String(error));
    } finally {
      setIsResending(false)
    }
  };

  useEffect(() => {
    let countdown: NodeJS.Timeout | null = null;
    if (timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (countdown) clearInterval(countdown);
    };
  }, [timer]);

  return (
    <Dialog open={isVerifyOtpDialogOpen} onOpenChange={setIsVerifyOtpDialogOpen}>
      <DialogContent className="sm:max-w-[600px] px-0">
        <DialogHeader className="px-4">
          <DialogTitle className="mb-2 flex items-center gap-1"> <ChevronLeft size={24} /> Enter OTP</DialogTitle>
          <DialogDescription className="text-xs">
            An OTP has been sent to your phone number, kindly enter the 6 digits below.
          </DialogDescription>
        </DialogHeader>
        <div className="bg-[#EDF2F675]">
          <hr />
          <div className="px-4 mt-4 mb-6">
            <form onSubmit={handleSubmit} className="w-full">
              <section className="w-full mt-6 sm:mt-8 md:mt-10">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                  className="rounded-none"
                >
                  <InputOTPGroup className="w-full flex gap-1 sm:gap-2 justify-between rounded-none">
                    {[...Array(6)].map((_, index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        className="w-20 h-20 border text-xl sm:text-2xl md:text-3xl lg:text-4xl rounded-none"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
                <div className="mt-4">
                  <div className="flex justify-center mt-2">
                    <Button
                      variant={"link"}
                      className="flex gap-1 text-xs sm:text-sm cursor-pointer"
                      onClick={(e) => { }}
                    >
                      Resend a new Code (59s)
                    </Button>
                  </div>
                </div>
              </section>
            </form>
          </div>
          <hr />
        </div>
        <DialogFooter className="px-4">
          <Button onClick={() => {
            setShowSuccessDialog(true)
            setIsVerifyOtpDialogOpen(false)
          }}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog >
  )
}

export default PaymentOtpDialog
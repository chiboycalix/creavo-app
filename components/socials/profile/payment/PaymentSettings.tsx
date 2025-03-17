"use client";
import React, { FormEvent, useState } from "react";
import VerifyPhoneDialog from "./VerifyPhoneDialog";
import PaymentOtpDialog from "./PaymentOtpDialog";
import SuccessDialog from "@/components/SuccessDialog";
import { Input } from "@/components/Input";
import { SelectInput } from "@/components/Input/SelectInput";
import { Button } from "@/components/ui/button";

const PaymentSettings = () => {
  const [isVerifyPhoneDialogOpen, setIsVerifyPhoneDialogOpen] = useState(false);
  const [isVerifyOtpDialogOpen, setIsVerifyOtpDialogOpen] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
  }

  return (
    <div className="">
      <div className="flex flex-col justify-center gap-3 pb-2 mb-7">
        <h2 className="text-lg font-semibold mb-3">Payments</h2>
        <p className="text-black text-sm">
          Set up your bank account to receive payment from Crevoe
        </p>

        {/* Bank Information Section */}
        <div className="p-1">
          <h3 className="text-md font-bold mb-4">Bank Information</h3>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Input
                label="Account Number"
                type="number"
                placeholder="Account number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="bg-white"
              />
            </div>

            <div>
              <SelectInput
                label="Bank"
                options={[
                  {
                    label: "Bank A",
                    value: "banka"
                  },
                  {
                    label: "Bank B",
                    value: "bankb"
                  }
                ]}
              />
            </div>

            {/* Account Name */}
            <div>
              <Input
                label="Account name"
                placeholder="Account name"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
              />
            </div>

            <div className="flex justify-end">

              <Button type="submit" className="px-8" onClick={() => setIsVerifyPhoneDialogOpen(true)}>Save</Button>

              <VerifyPhoneDialog
                setIsVerifyPhoneDialogOpen={setIsVerifyPhoneDialogOpen}
                isVerifyPhoneDialogOpen={isVerifyPhoneDialogOpen}
                setIsVerifyOtpDialogOpen={setIsVerifyOtpDialogOpen}
              />

              <PaymentOtpDialog
                isVerifyOtpDialogOpen={isVerifyOtpDialogOpen}
                setIsVerifyOtpDialogOpen={setIsVerifyOtpDialogOpen}
                setShowSuccessDialog={setShowSuccessDialog}
              />

              <SuccessDialog
                showSuccessDialog={showSuccessDialog}
                setShowSuccessDialog={setShowSuccessDialog}
                caption='Continue'
                successMessage="Congratulations! You have successfully added your bank details."
              />

            </div>
          </form>

          <hr className="mt-6" />
        </div>
      </div>
    </div>
  );
};

export default PaymentSettings;

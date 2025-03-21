"use client";
import { Trash2Icon } from "lucide-react";
import React, { useState } from "react";
import { useSettings } from "@/context/SettingsContext";

const PaymentSettings = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const { setBankAccountDetails } = useSettings();


  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (setBankAccountDetails) {
      setBankAccountDetails({ accountNumber, bankName, accountName });
    }
  };

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

          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => handleSubmit(e)}
          >
            <div className="flex flex-col">
              <label className="text-sm mb-1 font-semibold">
                Account Number
              </label>
              <input
                type="number"
                className=" border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-sm"
                placeholder="Account number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm mb-1 font-semibold">Bank Name</label>
              <input
                type="text"
                className=" border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-sm"
                placeholder="Bank name"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
              />
            </div>

            {/* Account Name */}
            <div className="flex flex-col">
              <label className="text-sm mb-1 font-semibold">Account Name</label>
              <input
                type="text"
                className=" border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-sm"
                placeholder="Account name"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
              />
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentSettings;

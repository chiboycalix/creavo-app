
"use client";
import { Trash2Icon } from "lucide-react";
import React, { useState } from "react";

const PaymentSettings = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const [bank, setBank] = useState("");
  const [accountName, setAccountName] = useState("");

  const banks = ["Bank A", "Bank B", "Bank C", "Bank D"]; // Replace with real bank names

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

          <form className="flex flex-col gap-4">
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
              <label className="text-sm mb-1 font-semibold">Bank</label>
              <select
                className="text-sm border p-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={bank}
                onChange={(e) => setBank(e.target.value)}
              >
                <option className="text-sm font-thin" value="">
                  Select Bank
                </option>
                {banks.map((bankName, index) => (
                  <option
                    key={index}
                    value={bankName}
                    className="text-sm font-thin"
                  >
                    {bankName}
                  </option>
                ))}
              </select>
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
"use client";

import { Trash2Icon } from "lucide-react";
import React from "react";

const AccountSettings = () => {

  return (
    <div className="">
      <div className="flex flex-col gap-3  pb-2 mb-7">
        <h2 className="text-lg font-semibold mb-3">Account</h2>
        <div className="flex justify-between">
          <div className="font-medium">Account Region</div>
          <div>
            <select name="" id="" className="text-sm">
              <option value="">Nigeria</option>
            </select>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="font-medium">Delete Account</div>
          <div>
            <Trash2Icon className="text-red-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;

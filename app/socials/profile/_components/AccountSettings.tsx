"use client";

import { Switch } from "@headlessui/react";
import { Trash2Icon } from "lucide-react";
import React, { useState } from "react";

const AccountSettings = () => {
  const [enabled, setEnabled] = useState(false);

  return (
    <div>
      <div className="flex flex-col gap-3 border-b-2 pb-2 mb-7">
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

      <div className="flex flex-col gap-3 border-b-2 pb-2 mb-7">
        <h2 className="text-lg font-semibold mb-3">Privacy</h2>
        <div className="flex justify-between">
          <div>
            <div className="font-medium">Private Account</div>
            <p className="text-sm text-gray-600">
              When your account is private, only followers you approve can
              follow you and view your posts. Your current followers won’t be
              affected.
            </p>
          </div>
          <div>
            <Switch
              checked={enabled}
              onChange={setEnabled}
              className="group relative flex w-14 cursor-pointer rounded-lg p-1 bg-white transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-[#00856E] data-[unchecked]:bg-black border shadow-sm"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-black ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7 border-white"
              />
            </Switch>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="font-medium">Blocked Accounts</div>
          <div>
            <select name="" id="" className="text-sm">
              <option value=""></option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-b-2 pb-2 mb-7">
        <h2 className="text-lg font-semibold mb-3">Push Notifications</h2>
        <div className="flex justify-between">
          <div>
            <div className="font-medium">Allow in-browser notifications</div>
          </div>
          <div>
            <Switch
              checked={enabled}
              onChange={setEnabled}
              className="group relative flex w-14 cursor-pointer rounded-lg p-1 bg-white transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-[#00856E] data-[unchecked]:bg-black border shadow-sm"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-black ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7 border-white"
              />
            </Switch>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="font-medium">Social Interactions</div>
          <div>
            <select name="" id="" className="text-sm">
              <option value=""></option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;

"use client";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Switch,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import React, { useState } from "react";

const PrivacySettings = () => {
  const [notifEnabled, setNotifEnabled] = useState(false);
  return (
    <div className="">
      <div className="flex flex-col gap-3  pb-2 mb-7">
        <h2 className="text-lg font-semibold mb-3">Privacy</h2>
        <div className="flex justify-between">
          <div>
            <div className="font-medium">Private Account</div>
            <p className="text-sm text-red-500">
              When your account is private, only followers you approve can
              follow you and view your posts. Your current followers won’t be
              affected.
            </p>
          </div>
          <div>
            <Switch
              checked={notifEnabled}
              onChange={setNotifEnabled}
              className="group relative flex items-center w-8 h-4 cursor-pointer rounded-lg bg-white transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-[#00856E] data-[unchecked]:bg-black border shadow-sm"
            >
              <span
                aria-hidden="true"
                className="h-3 w-3 pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-black ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-4 border-white"
              />
            </Switch>
          </div>
        </div>

        <Disclosure as="div" className="" defaultOpen={true}>
          <DisclosureButton className="group flex w-full items-center justify-between mb-3">
            <span className=" font-medium text-black group-data-[hover]:text-black">
              Blocked Accounts
            </span>
            <ChevronDownIcon className="size-5 fill-black group-data-[hover]:fill-black group-data-[open]:rotate-180" />
          </DisclosureButton>
          <DisclosurePanel className=" text-black ">
            <div className="flex flex-col">
              <div className="font-medium text-sm text-red-500">@user1</div>
              <div className="font-medium text-sm text-red-500">@user2</div>
            </div>
          </DisclosurePanel>
        </Disclosure>
        <Disclosure as="div" className="" defaultOpen={true}>
          <DisclosureButton className="group flex w-full items-center justify-between mb-3">
            <span className=" font-medium text-black group-data-[hover]:text-black">
              Muted Accounts
            </span>
            <ChevronDownIcon className="size-5 fill-black group-data-[hover]:fill-black group-data-[open]:rotate-180" />
          </DisclosureButton>
          <DisclosurePanel className=" text-black">
            <div className="flex flex-col">
              <div className="font-medium text-sm text-green-500">@user1</div>
              <div className="font-medium text-sm text-green-500">@user2</div>
            </div>
          </DisclosurePanel>
        </Disclosure>
      </div>
    </div>
  );
};

export default PrivacySettings;

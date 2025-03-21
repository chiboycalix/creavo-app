"use client";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Switch,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";
import { useSettings } from "@/context/SettingsContext";

const PrivacySettings = () => {
  const {
    updateUserPrivacy,
    userPrivacy,
    setUserPrivacy,
    fetchBlockedUsers,
    fetchMutedUsers,
  } = useSettings();
  const [blockedUsers, setBlockedUsers] = useState<any>([]);
  const [mutedUsers, setMutedUsers] = useState<any>([]);

  const handlePrivacyChange = () => {
    setUserPrivacy?.((prev: any) => {
      const newPrivacy = !prev;
      updateUserPrivacy?.(newPrivacy);
      return newPrivacy;
    });
  };

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
              checked={userPrivacy}
              onChange={handlePrivacyChange}
              className={`group relative flex items-center w-8 h-4 cursor-pointer rounded-lg bg-white transition-colors duration-200 ease-in-out focus:outline-none 
              ${userPrivacy ? "bg-[#00856E]" : "bg-black"} border shadow-sm`}
            >
              <span
                aria-hidden="true"
                className={`h-3 w-3 pointer-events-none inline-block size-5 rounded-full bg-black ring-0 shadow-lg transition duration-200 ease-in-out 
                ${
                  userPrivacy ? "translate-x-4" : "translate-x-0"
                } border-white`}
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
              {blockedUsers?.length > 0 ? (
              blockedUsers.map((user: any) => (
                <div key={user.id} className="font-medium text-sm text-red-500">
                @{user.username}
                </div>
              ))
              ) : (
              <div className="font-medium text-sm text-red-500">
                No muted users
              </div>
              )}
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
              {mutedUsers?.length > 0 ? (
              mutedUsers?.map((user: any) => (
                <div key={user.id} className="font-medium text-sm text-red-500">
                @{user.username}
                </div>
              ))
              ) : (
              <div className="font-medium text-sm text-green-500">
                No muted users
              </div>
              )}
            </div>
          </DisclosurePanel>
        </Disclosure>
      </div>
    </div>
  );
};

export default PrivacySettings;

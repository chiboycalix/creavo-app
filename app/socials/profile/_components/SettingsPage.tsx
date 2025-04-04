"use client";

import React, { useState } from "react";
import {
  BellIcon,
  CreditCardIcon,
  GlobeLockIcon,
  MoveLeftIcon,
  UserRoundIcon,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabSettingsList,
  TabSettingsTrigger,
} from "@/components/ui/tabs";
import { Dialog, DialogPanel, TransitionChild } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import AccountSettings from "./AccountSettings";
import PrivacySettings from "./PrivacySettings";
import NotificationSettings from "./NotificationSettings";
import PaymentSettings from "./PaymentSettings";
import { useSettings } from "@/context/SettingsContext";

const ProfileSettings = ({ handleClose }: any) => {
  const { openSettingsModal } = useSettings()
  const tabsMenu = [
    { title: "Account", icon: UserRoundIcon },
    { title: "Privacy", icon: GlobeLockIcon },
    { title: "Notifications", icon: BellIcon },
    { title: "Payments", icon: CreditCardIcon },
  ];
  const [activeTab, setActiveTab] = useState<string>(tabsMenu[0].title);
  const handleTabChange = (category: string) => setActiveTab(category);

  return (
    <AnimatePresence>
      {openSettingsModal && (
        <Dialog
          open={openSettingsModal}
          as="div"
          className=" bg-white fixed inset-0 z-50 flex items-center justify-center"
          onClose={() => console.log(open)}
        >
          <TransitionChild
            as={motion.div}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            className="fixed inset-0 bg-opacity-50"
          />

          <div className=" bg-[#EDF2F675] fixed inset-0 flex flex-col gap-2 items-center justify-center">
            <div className="w-[70%] flex  justify-start">
              <button
                onClick={handleClose}
                className=" flex text-black gap-2 hover:shadow-md p-2 hover:rounded-sm transition"
              >
                <MoveLeftIcon />
                <span>Back</span>
              </button>
            </div>
            <DialogPanel
              as={motion.div}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className=" w-[70%] h-[80vh] bg-[#EDF2F675]"
            >
              <Tabs
                value={activeTab}
                className="grid grid-cols-4 gap-4 w-[100%] h-[70vh] bg-transparent p-1 bg-blue-500"
              >
                <TabSettingsList className="col-span-1 h-full bg-white flex flex-col px-2 gap-4 rounded-md pt-5">
                  {tabsMenu.map((tab, index) => (
                    <TabSettingsTrigger
                      key={index}
                      value={tab.title}
                      onClick={() => handleTabChange(tab.title)}
                      className="py-3 flex items-center gap-2 text-left text-sm px-4 hover:bg-gray-100 rounded-lg transition-all data-[state=active]:text-[#0073B4] data-[state=active]:font-semibold"
                    >
                      <tab.icon />
                      <span>{tab.title}</span>
                    </TabSettingsTrigger>
                  ))}
                </TabSettingsList>

                <div className="col-span-3 h-full border bg-white overflow-y-auto custom-scrollbar rounded-md">
                  {tabsMenu.map((tab, index) => (
                    <TabsContent
                      key={index}
                      value={tab.title}
                      className="h-full p-4 pl-6 overflow-y-auto custom-scrollbar"
                    >
                      {tab.title === "Account" && <AccountSettings />}
                      {tab.title === "Privacy" && <PrivacySettings />}
                      {tab.title === "Notifications" && (
                        <NotificationSettings />
                      )}
                      {tab.title === "Payments" && <PaymentSettings />}
                    </TabsContent>
                  ))}
                </div>
              </Tabs>
            </DialogPanel>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default ProfileSettings;

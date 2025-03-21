"use client";

import { ChevronRightIcon, Trash2Icon, XIcon } from "lucide-react";
import React, { useMemo, useState } from "react";
import { Dialog, DialogPanel, TransitionChild } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import countryList from "react-select-country-list";

const AccountSettings = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const options = useMemo(() => countryList().getData(), []);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(
    "Nigeria"
  );

  const updateUserCountry = () => {
    console.log("country updated");
  };

  const handleDeleteUser = () => {
    console.log("User Deleted");
  };
  return (
    <div>
      {/* Account Settings */}
      <div className="flex flex-col gap-3 pb-2 mb-7">
        <h2 className="text-lg font-semibold mb-3">Account</h2>

        <div className="flex justify-between mb-4">
          <div className="font-medium">Account Region</div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-[#3D3D3D] hover:cursor-pointer flex items-center"
          >
            <strong>{selectedCountry} </strong>{" "}
            <span>
              <ChevronRightIcon />
            </span>
          </button>
        </div>

        <div className="flex justify-between items-start">
          <div className="flex flex-col items">
            <div className="font-medium">Delete Account</div>
            <p className="text-red-500 text-sm w-3/5">
              This action will deactivate your account for 30 days, after which
              your account will be permanently deleted, with all data inclusive
              and not reversible.
            </p>
          </div>
          <button
            onClick={() => setDeleteModalOpen(true)}
            className="text-[#3D3D3D] hover:cursor-pointer flex items-center"
          >
            <span>
              <Trash2Icon className="text-red-500 cursor-pointer" />
            </span>
          </button>
        </div>
      </div>

      {/* Country Selection Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <Dialog
            open={isModalOpen}
            as="div"
            className="bg-[#00101A33] fixed inset-0 z-50 flex items-center justify-center"
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
              className=" inset-0 bg-opacity-50"
            />

            <div className="flex flex-col items-center bg-[#FAFDFF] rounded-lg shadow-md">
              <div className="flex flex-col items-start w-full px-5 py-2 border-b-2 mb-3">
                <div className="flex justify-between items-center w-full">
                  <h3 className="font-semibold mb-2">Select a Country</h3>
                  <div>
                    <button onClick={() => setIsModalOpen(false)} className="">
                      <XIcon className="text-gray-600 hover:text-black" />
                    </button>
                  </div>
                </div>
                <p className="text-xs">
                  Your country is currently set to{" "}
                  <strong>{selectedCountry}</strong>, you can select another
                  country.
                </p>
              </div>

              <div className="w-full py-2 px-5 mb-3">
                <input
                  type="text"
                  name=""
                  id=""
                  placeholder="Search"
                  className="w-full border border-[#DCDCDC] p-2 rounded-md placeholder:font-semibold placeholder:"
                />
              </div>
              <DialogPanel
                as={motion.div}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="h-[50vh] w-[80vh]  overflow-y-auto custom-scrollbar"
              >
                {/* Country Selection */}
                <div className="space-y-2 flex flex-col w-full items=start bg-[#FAFDFF] px-5">
                  {options?.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center w-full list-none gap-2"
                    >
                      <input
                        type="radio"
                        id={`country-${index}`}
                        name="country"
                        value={item?.label}
                        checked={selectedCountry === item?.label}
                        onChange={() => setSelectedCountry(item?.label)}
                        className="cursor-pointer p-2"
                      />
                      <label
                        htmlFor={`country-${index}`}
                        className="cursor-pointer font-bold w-full"
                      >
                        {item?.label}
                      </label>
                    </li>
                  ))}
                </div>
              </DialogPanel>
              <div className="bg-white border-t-2 py-3 flex justify-end w-full px-2">
                <button
                  onClick={updateUserCountry}
                  className="bg-[#0073B4] text-white p-2 px-4 rounded-md"
                >
                  Save
                </button>
              </div>
            </div>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Delete Account Modal */}
      <AnimatePresence>
        {deleteModalOpen && (
          <Dialog
            open={deleteModalOpen}
            as="div"
            className="bg-[#00101A33] fixed inset-0 z-50 flex items-center justify-center"
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
              className=" inset-0 bg-opacity-50"
            />

            <div className="flex flex-col items-center bg-[#FAFDFF] rounded-lg shadow-md">
              <div className="flex flex-col items-start w-full px-5 py-3 border-b-2 mb-3">
                <div className="flex justify-between items-center w-full">
                  <h3 className="font-semibold mb-2">Delete Account</h3>
                  <div>
                    <button
                      onClick={() => setDeleteModalOpen(false)}
                      className=""
                    >
                      <XIcon className="text-gray-600 hover:text-black" />
                    </button>
                  </div>
                </div>
              </div>

              <DialogPanel
                as={motion.div}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="  h-[50vh] w-[80vh]  overflow-y-auto custom-scrollbar"
              >
                <div className="space-y-2 flex flex-col w-full justify-center bg-[#FAFDFF] px-5">
                  <p className="text-sm">
                    We&apos;re sorry to see you go. Before proceeding, please
                    read the following carefully:
                  </p>
                  <ul className="list-disc flex flex-col justify-center items-center px-4 py-4 gap-3">
                    <li className="text-sm">
                      <strong>Deactivation Period:</strong> Once you initiate
                      account deletion, your account will be deactivated for 30
                      days. During this time, you will not be able to access
                      your account or any of its associated features.
                    </li>
                    <li className="text-sm">
                      <strong>Permanent Deletion:</strong> After the 30-day
                      deactivation period, your account and all associated
                      data—including your profile, settings, transaction
                      history, and any saved information—will be permanently
                      deleted. This action is irreversible, and once deleted,
                      your data cannot be recovered.
                    </li>
                    <li className="text-sm">
                      <strong>Reactivation Window:</strong> If you change your
                      mind during the 30-day deactivation period, you can log
                      back in to cancel the deletion and restore your account.
                      However, after the period expires, your account will be
                      removed permanently.
                    </li>
                  </ul>
                  <p className="text-sm">
                    If you are sure you want to proceed, please confirm your
                    decision below. If you need assistance or have any concerns,
                    feel free to reach out to our support team before finalizing
                    your request.
                  </p>
                </div>
              </DialogPanel>
              <div className="bg-white border-t-2 py-3 flex justify-end w-full px-2">
                <button
                  onClick={handleDeleteUser}
                  className="bg-[#C74E5B] text-white p-2 px-4 rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AccountSettings;

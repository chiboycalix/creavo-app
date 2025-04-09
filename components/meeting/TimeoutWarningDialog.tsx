import React from "react";
import { Dialog, DialogPanel, TransitionChild } from "@headlessui/react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button"; // adjust path based on your structure

interface TimeoutWarningDialogProps {
  open: boolean;
  onStay: () => void;
  onLeave: () => void;
}

const TimeoutWarningDialog: React.FC<TimeoutWarningDialogProps> = ({
  open,
  onStay,
  onLeave,
}) => {
  return (
    <Dialog
      open={open}
      as="div"
      className="bg-transparent fixed inset-0 z-[200] flex items-center justify-center"
      onClose={() => {}}
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

      <div className="bg-[#EDF2F675] fixed inset-0 flex flex-col gap-2 items-center justify-center">
        <DialogPanel
          as={motion.div}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full h-[100vh] bg-[#EDF2F675] flex items-center justify-center"
        >
          <div className="bg-white rounded-lg p-4 shadow-md flex flex-col items-center justify-center">
            <h2 className="text-lg font-semibold">
              There is no one else in the meeting room.
            </h2>
            <h2 className="text-lg font-semibold">
              Would you like to stay or leave?
            </h2>

            <div className="flex items-center justify-center gap-4 mt-4">
              <Button
                onClick={onStay}
                className="bg-gray-600 w-20 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                Stay
              </Button>
              <Button
                onClick={onLeave}
                className="bg-red-600 w-22 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Leave
              </Button>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default TimeoutWarningDialog;

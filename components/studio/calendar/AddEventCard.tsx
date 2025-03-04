import React from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { TextInput } from '@/components/Input/TextInput';
import { TextareaInput } from '@/components/Input/TextareaInput';
import { TimeRangePickerInput } from '@/components/Input/TimeRangePickerInput';
import { TimePickerInput } from '@/components/Input/TimePickerInput';
import { DatePickerInput } from '@/components/Input/DatePickerInput';
import { Checkbox } from '@/components/ui/check-box';
import { SelectInput } from '@/components/Input/SelectInput';
type EventDetailsProps = {
  isOpen: boolean;
  onClose: () => void;
  anchorRect?: DOMRect | null;
  data?: any
};

const AddEventCard = ({ isOpen, onClose, anchorRect, data }: EventDetailsProps) => {
  console.log({ data })

  const menuPosition = {
    top: 0,
    right: 0,
  };

  if (!anchorRect) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50"
          />

          {/* Menu */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            style={{
              position: 'fixed',
              top: menuPosition.top,
              right: menuPosition.right,
              transformOrigin: 'bottom right'
            }}
            className="z-50 w-[28rem] bg-white border rounded-lg shadow-2xl h-[100vh] p-3"
          >
            <div className='h-full overflow-y-auto'>
              <div className='flex justify-between items-center'>
                <p className='font-semibold'>Add Event</p>
                <X size={18} onClick={onClose} className='cursor-pointer' />
              </div>
              <div className='mt-4'>
                <p className='text-sm font-semibold'>Event description</p>
              </div>
              <div className='mt-6'>
                <TextInput
                  label="Title"
                  placeholder='John doe'
                  onChange={() => { }}
                />
              </div>
              <div className='mt-6'>
                <TextareaInput
                  label="Description"
                  placeholder='Enter event description'
                  resize="none"
                  onChange={() => { }}
                />
              </div>
              <div className='mt-6'>
                <p className='text-sm font-semibold'>Additional information</p>
              </div>
              <div className='mt-6 flex items-center justify-between gap-2'>
                <div className='basis-1/2'>
                  <DatePickerInput
                    label="Start date"
                  />
                </div>
                <div className='flex-1'>
                  <TimePickerInput
                    label="Start time"
                  />
                </div>
              </div>
              <div className='mt-6 flex items-center justify-between gap-2'>
                <div className='basis-1/2'>
                  <DatePickerInput
                    label="End date"
                  />
                </div>
                <div className='flex-1'>
                  <TimePickerInput
                    label="End time"
                  />
                </div>
              </div>
              <div className='mt-6 flex flex-col gap-4'>
                <Checkbox label="All" />
                <Checkbox label="Repeat event" />
              </div>
              <div className='mt-6'>
                <TextInput
                  label="Event Location"
                  placeholder='The location can be a place or a URL'
                  onChange={() => { }}
                />
              </div>
              <div className='mt-6'>
                <SelectInput
                  label="Add member"
                  options={[
                    {
                      label: "Chinonso",
                      value: "chinonso"
                    },
                    {
                      label: "Calix",
                      value: "calix"
                    },
                    {
                      label: "Nono",
                      value: "nono"
                    }
                  ]}
                  searchable={true}
                  multiSelect={true}
                  onChange={(values) => console.log("Selected:", values)}
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default AddEventCard
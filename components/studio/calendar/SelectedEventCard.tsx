import React from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
type EventDetailsProps = {
  isOpen: boolean;
  onClose: () => void;
  anchorRect?: DOMRect | null;
  data: any
};

const SelectedEventCard = ({ isOpen, onClose, anchorRect, data }: EventDetailsProps) => {
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
            <div className='flex justify-between items-center'>
              <p className='font-semibold'>Event Details</p>
              <X size={18} onClick={onClose} className='cursor-pointer' />
            </div>
            hi
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default SelectedEventCard
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion';

type FollowingProps = {
  isOpen: boolean;
  onClose: () => void;
  anchorRect?: DOMRect | null;
};

const FollowingCard = ({ isOpen, onClose, anchorRect }: FollowingProps) => {
  if (!anchorRect) return null;

  const menuPosition = {
    top: 90,
    right: 20,
  };


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
            className="z-50 w-96 bg-white rounded-lg shadow-lg h-[87vh] p-3"
          >
            hi
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default FollowingCard
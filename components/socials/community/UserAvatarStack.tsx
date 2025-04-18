"use client";
import Image from "next/image";
import React, { useState } from "react";
import {
  motion,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "motion/react";
import { Check } from "lucide-react";

const UserAvatarStack = ({
  items,
  maxVisible = 3,
  handleManualAdd,
  handleLinkCourse,
}: {
  maxVisible?: number,
  onClick?: any;
  items: {
    id: number;
    name: string;
    designation?: string;
    image: string;
  }[];
  handleManualAdd?: any;
  handleLinkCourse?: any;
}) => {
  const [addMember, setAddMember] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const springConfig = { stiffness: 100, damping: 5 };
  const x = useMotionValue(0);

  const rotate = useSpring(
    useTransform(x, [-100, 100], [-45, 45]),
    springConfig,
  );
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-50, 50]),
    springConfig,
  );
  const handleMouseMove = (event: any) => {
    const halfWidth = event.target.offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth);
  };

  const handleAddMember = () => {
    setAddMember(!addMember);
  };

  const visibleItems = items?.slice(0, maxVisible);
  const additionalCount = items?.length > maxVisible ? items?.length - maxVisible : 0;

  return (
    <div className="flex items-center">
      {visibleItems.map((item, idx) => (
        <div
          className="group relative -mr-4"
          key={item.name}
          onMouseEnter={() => setHoveredIndex(item.id)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence mode="popLayout">
            {hoveredIndex === item.id && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 260,
                    damping: 10,
                  },
                }}
                exit={{ opacity: 0, y: 20, scale: 0.6 }}
                style={{
                  translateX: translateX,
                  rotate: rotate,
                  whiteSpace: "nowrap",
                }}
                className="absolute -top-16 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center justify-center rounded-md bg-black px-4 py-2 text-xs shadow-xl"
              >
                <div className="absolute inset-x-10 -bottom-px z-30 h-px w-[20%] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
                <div className="absolute -bottom-px left-10 z-30 h-px w-[40%] bg-gradient-to-r from-transparent via-sky-500 to-transparent" />
                <div className="relative z-30 text-base font-bold text-white">
                  {item.name}
                </div>
                {
                  item?.designation && <div className="text-xs text-white">{item.designation}</div>
                }

              </motion.div>
            )}
          </AnimatePresence>
          <Image
            onMouseMove={handleMouseMove}
            height={100}
            width={100}
            src={item.image}
            alt={item.name}
            className="relative !m-0 h-10 w-10 rounded-full border-2 border-white object-cover object-top !p-0 transition duration-500 group-hover:z-30 group-hover:scale-105"
          />
        </div>
      ))}

      <div className="relative flex items-center mr-2">
        <AnimatePresence>
          {addMember && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden w-[10rem] rounded-md shadow-lg mt-4 border border-gray-100 absolute top-8 -left-16 z-[100]"
            >
              <div className="px-4 py-2 bg-white">
                <div
                  className="flex items-center gap-2 group hover:bg-primary-600 cursor-pointer px-2 py-1 rounded-sm"
                  onClick={handleManualAdd}
                >
                  <div className="w-3 h-3 hidden group-hover:inline-block">
                    <Check className="text-primary group-hover:bg-white w-3 h-3" />
                  </div>
                  <span className="group-hover:text-white text-sm inline-block">
                    Add manually
                  </span>
                </div>

                <div
                  className="group flex items-center gap-2 hover:bg-primary-600 cursor-pointer px-2 py-1 rounded-sm"
                  onClick={handleLinkCourse}
                >
                  <div className="w-3 h-3 hidden group-hover:inline-block">
                    <Check className="text-primary group-hover:bg-white w-3 h-3" />
                  </div>
                  <span className="group-hover:text-white text-sm inline-block">
                    Link a course
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {additionalCount > 0 && (
          <span className="ml-2 text-gray-600 font-semibold">+{additionalCount}</span>
        )}
      </div>
    </div>
  );
};

export default UserAvatarStack;
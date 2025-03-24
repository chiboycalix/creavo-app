"use client"
import HeaderImage from '@/components/HeaderImage';
import { Card } from '@/components/ui/card';
import { CrevoeLogo } from '@/public/assets';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface CarouselText {
  id: number;
  title: string;
  description: string;
}

const carouselTexts: CarouselText[] = [
  {
    id: 1,
    title: "Welcome to Crevoe",
    description: "Discover, share, and grow your skills in an integrated, flexible environment for guides and learners."
  },
  {
    id: 2,
    title: "Seamless Knowledge Sharing",
    description: "Guides can easily create and share courses, videos, e-books, and live webinars all in one place."
  },
  {
    id: 3,
    title: "Dynamic Learning Paths",
    description: "Microlearning through short videos categorized as basic, proficient, and advanced. Tailor your learning journey to your pace and goals."
  }
];


export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === carouselTexts.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const slideVariants = {
    enter: {
      y: 20,
      opacity: 0
    },
    center: {
      y: 0,
      opacity: 1
    },
    exit: {
      y: -20,
      opacity: 0
    }
  };

  const transition = {
    y: { type: "spring", stiffness: 300, damping: 30 },
    opacity: { duration: 0.2 }
  };

  return (
    <div className="h-screen flex flex-col md:flex-row bg-primary-50/80 p-8 gap-10">
      <div className='hidden md:block md:basis-5/12 h-full'>
        <div className="relative h-full w-full overflow-hidden rounded-3xl">
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/assets/SplashBg.png')",
              backgroundBlendMode: "overlay",
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50" />
          </div>

          <div className="relative h-full flex items-end justify-center pb-12">
            <div className="w-full max-w-4xl px-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={transition}
                  className="text-left"
                >
                  <motion.h2
                    className="text-md md:text-lg lg:text-2xl font-bold text-white mb-4"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {carouselTexts[currentIndex].title}
                  </motion.h2>

                  <motion.p
                    className="text-sm text-gray-200"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {carouselTexts[currentIndex].description}
                  </motion.p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <Card className="border-none flex-1 md:w-1/2 px-6 py-8 md:px-20 md:py-12 flex flex-col rounded-3xl justify-center">
        <div className="flex flex-col justify-center items-center mb-6">
          <HeaderImage src={CrevoeLogo} />
          <div className='mt-4 w-full'>{children}</div>
        </div>
      </Card>
    </div>
  );
}

import React, { useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { AnimatePresence, motion, MotionConfig } from 'framer-motion'
import { useSwipeable } from 'react-swipeable'
import { variants } from '@/utils/animationVariants'
import { PostMediaType } from '@/context/PostContext'
import Link from 'next/link'

type GallerySliderTypes = {
  galleryImgs: PostMediaType[]
  className: string
  imageClass?: string
  navigation?: boolean
  ratioClass?: string
  galleryClass?: string
}
const GallerySlider = ({
  galleryImgs,
  className = '',
  imageClass = '',
  galleryClass = 'rounded-xl',
  navigation = true,
}: GallerySliderTypes) => {
  const [loaded, setLoaded] = useState(false)
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const images = galleryImgs?.length > 0 ? galleryImgs : []

  const isImage = /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(
    galleryImgs[index]?.url || ''
  )

  const changePhotoId = (newVal: number) => {
    if (newVal > index) {
      setDirection(1)
    } else {
      setDirection(-1)
    }
    setIndex(newVal)
  }

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (index < images?.length - 1) {
        changePhotoId(index + 1)
      }
    },
    onSwipedRight: () => {
      if (index > 0) {
        changePhotoId(index - 1)
      }
    },
    trackMouse: true,
  })

  const currentMedia = images[index]

  // Prevent the code from breaking if galleryImgs is empty
  if (!images || images.length === 0) {
    return <div>No images to display.</div>
  }

  return (
    <MotionConfig
      transition={{
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      }}
    >
      <div
        className={`relative  group group/cardGallerySlider ${className}`}
        {...handlers}
      >
        {/* Main image */}
        <div className={` h-full overflow-hidden ${galleryClass}`}>
          <Link
            className={`relative flex items-center justify-center h-full `}
            href={''}
          >
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={index}
                custom={direction}
                variants={variants(340, 1)}
                initial="enter"
                animate="center"
                // exit="exit"
                className="h-full"
              >
                {isImage ? (
                  <img
                    src={currentMedia?.url || ''}
                    alt="listing card gallery"
                    className={`object-cover h-full`}
                    onLoad={() => setLoaded(true)}
                  />
                ) : (
                  <video
                    src={currentMedia?.url || ''}
                    className={`object-cover ${imageClass}`}
                    onLoad={() => setLoaded(true)}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </Link>
        </div>

        {/* Buttons + bottom nav bar */}
        <>

          {images.length > 1 && (
            <>
              <div className="absolute z-[500] bottom-0 inset-x-0 h-10 bg-gradient-to-t from-neutral-900 opacity-50 rounded-b-lg"></div>
              <div className="flex items-center justify-center absolute bottom-2 left-1/2 transform -translate-x-1/2 space-x-1.5">
                {images?.map((_, i) => (
                  <button
                    className={`w-1.5 relative z-[500] h-1.5 rounded-full ${i === index ? 'bg-white' : 'bg-white/60 '
                      }`}
                    onClick={() => changePhotoId(i)}
                    key={i}
                  />
                ))}
              </div>
            </>
          )}
        </>
      </div>
    </MotionConfig>
  )
}

export default GallerySlider

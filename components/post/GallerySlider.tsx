import React, { useState } from 'react'
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
                    className={`object-contain md:max-h-[87vh] h-[calc(87vh)]`}
                    onLoad={() => setLoaded(true)}
                  />
                ) : (
                  <video
                    src={currentMedia?.url || ''}
                    className={`object-cover h-screen ${imageClass}`}
                    onLoad={() => setLoaded(true)}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </Link>
        </div>

        {/* Buttons + bottom nav bar */}
        <div className=''>

          {images.length > 1 && (
            <div className="flex justify-center space-x-2 mt-4">
              {images.map((_, i) => (
                <button
                  key={i}
                  className={`h-2 w-2 relative bottom-2 z-20 rounded-full ${i === index ? 'bg-primary-700' : 'bg-gray-400'
                    }`}
                  onClick={() => changePhotoId(i)}
                />
              ))}
            </div>
          )}

        </div>
      </div>
    </MotionConfig>
  )
}

export default GallerySlider

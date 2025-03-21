import React, { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, MotionConfig } from 'framer-motion'
import { useSwipeable } from 'react-swipeable'
import { variants } from '@/utils/animationVariants'
import { PostMediaType } from '@/context/PostContext'
import { getMimeTypeFromCloudinaryUrl } from '@/utils'
import { cn } from '@/lib/utils'
import { Loader } from 'lucide-react'

type GallerySliderTypes = {
  galleryImgs: PostMediaType[]
  className: string
  imageClass?: string
  navigation?: boolean
  ratioClass?: string
  galleryClass?: string
  isRenderedInComment?: boolean
  handleImageLoad: any
  handleVideoLoad: any
  imageRef: any
  videoRef: any
  isLandscape: boolean
}

const GallerySlider = ({
  galleryImgs,
  className = '',
  handleImageLoad,
  handleVideoLoad,
  imageRef,
  videoRef,
}: GallerySliderTypes) => {
  const [loaded, setLoaded] = useState(false)
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const images = galleryImgs?.length > 0 ? galleryImgs : []

  const mimeType = getMimeTypeFromCloudinaryUrl(galleryImgs && galleryImgs[0]?.url || '')
  const isImage = mimeType === "image/*" || galleryImgs[index]?.mimeType === "image/jpeg" || galleryImgs[index]?.mimeType === "image/*"

  const changePhotoId = (newVal: number) => {
    if (newVal > index) {
      setDirection(1)
    } else {
      setDirection(-1)
    }
    setIndex(newVal)
    setLoaded(false)
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
        className={`relative group group/cardGallerySlider w-full`}
        {...handlers}
      >
        {/* Main media container */}
        <div className={`h-full overflow-hidden rounded-none relative w-full`}>
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 max-w-full">
              <Loader className="animate-spin w-12 h-12 text-black" />
            </div>
          )}
          <Link
            className={`relative flex items-center justify-center h-full`}
            href={''}
          >
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={index}
                custom={direction}
                variants={variants(340, 1)}
                initial="enter"
                animate="center"
              >
                {isImage ? (
                  <img
                    loading="lazy"
                    src={currentMedia?.url || ''}
                    alt="listing card gallery"
                    className={cn(className, images?.length ? "h-[725px] w-full" : "h-[100vh] w-full object-cover")}
                    onLoad={() => {
                      setLoaded(true)
                      handleImageLoad()
                    }}
                    ref={imageRef}
                  />
                ) : (
                  <video
                    src={currentMedia?.url || ''}
                    className={className}
                    onLoadedData={() => {
                      setLoaded(true)
                      handleVideoLoad()
                    }}
                    ref={videoRef}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </Link>
        </div>

        {images.length > 1 && (
          <div className="flex justify-center space-x-2 mt-4">
            {images.map((_, i) => (
              <button
                key={i}
                className={`h-2 w-2 relative bottom-3 z-[5000] rounded-full ${i === index ? 'bg-primary-700' : 'bg-gray-400'
                  }`}
                onClick={() => changePhotoId(i)}
              />
            ))}
          </div>
        )}
      </div>
    </MotionConfig>
  )
}

export default GallerySlider
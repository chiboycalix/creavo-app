import CustomTab from '@/components/CustomTab'
import Saved from '@/components/socials/watchlist/Saved'
import Watching from '@/components/socials/watchlist/Watching'
import React from 'react'

const playlist = [
  {
    id: 1,
    type: "Basic",
    watched: "15:00mins",
    duration: "45:00mins",
    title: "Build it in Figma: Create a design system — Components",
    percentageComplete: 30,
    noOfVideos: 1,
    isPlaylist: false,
    thumbnail: ""
  },
  {
    id: 2,
    type: "Basic",
    watched: "45:00mins",
    duration: "45:00mins",
    title: "Build it in Figma: Create a design system — Components",
    percentageComplete: "100%",
    noOfVideos: 12,
    isPlaylist: true,
    thumbnail: "",
    modules: [
      {
        id: 1,
        title: "Introductory video",
        videos: [
          {
            id: 1,
            type: "lesson",
            title: "Build it in Figma: Create a design system — Components",
            duration: "45:00mins"
          },
          {
            id: 2,
            type: "lesson",
            title: "Build it in Figma: Create a design system — Components",
            duration: "45:00mins"
          },
          {
            id: 3,
            type: "quiz",
            title: "Build it in Figma: Create a design system — Components",
            duration: "45:00mins"
          }
        ]
      }
    ]
  },
  {
    id: 3,
    type: "Basic",
    watched: "15:00mins",
    duration: "45:00mins",
    thumbnail: "",
    title: "Build it in Figma: Create a design system — Components",
    percentageComplete: "30%",
    noOfVideos: 1,
    isPlaylist: false
  },
  {
    id: 4,
    type: "Basic",
    thumbnail: "",
    watched: "45:00mins",
    duration: "45:00mins",
    title: "Build it in Figma: Create a design system — Components",
    percentageComplete: "100%",
    noOfVideos: 12,
    isPlaylist: true
  }
]

const tabs = [
  {
    id: 1,
    title: "Watching",
    content: (<Watching />)
  },
  {
    id: 2,
    title: "Saved",
    content: (<Saved />)
  },
]

const Watchlist = () => {

  return (
    <div className='py-4'>
      <h2>Watchlist</h2>
      <div className='w-full mt-4'>
        <CustomTab tabs={tabs} defaultValue="watching" />
      </div>
    </div>
  )
}

export default Watchlist
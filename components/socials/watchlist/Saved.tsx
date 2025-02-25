import React from 'react'
import Playlist from './Playlist'

const Saved = () => {
  return (
    <div className='grid grid-cols-4 gap-4'>
      <Playlist
        value={34} />
      <Playlist value={25} />
      <Playlist value={18} />
      <Playlist value={51} />
      <Playlist
        value={31} />
      <Playlist value={85} />
      <Playlist value={18} />
      <Playlist value={51} />
      <Playlist
        value={64} />
      <Playlist value={100} />
      <Playlist value={18} />
      <Playlist value={8} />
    </div>
  )
}

export default Saved
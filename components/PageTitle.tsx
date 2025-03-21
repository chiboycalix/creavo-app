import React from 'react'

const PageTitle = ({ children }: { children: React.ReactNode }) => {
  return (
    <h2 className="font-bold text-2xl">{children}</h2>
  )
}

export default PageTitle
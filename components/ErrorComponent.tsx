import React from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card'
import { AlertTriangle } from 'lucide-react'

const ErrorComponent = ({ error }: { error: any }) => {
  return (
    <Card className="w-full overflow-hidden shadow-md">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-green">
          Expired Licenses
        </CardTitle>
        <CardDescription className="text-xs text-gray-400 font-normal">
          Top 5 LGAS
        </CardDescription>
      </CardHeader>
      <div className="flex flex-col items-center justify-center h-[300px] text-center p-4">
        <div className="flex items-center justify-center p-3 rounded-full bg-red-100 mb-2">
          <AlertTriangle className="h-6 w-6 text-red-500" />
        </div>
        <div className="font-semibold text-sm tracking-wide text-gray-500">
          Something went wrong!
        </div>
        <p className="text-xs text-gray-400 px-6">
          Failed to load lgas data: {error.message}. Please try again.
        </p>
      </div>
    </Card>
  )
}

export default ErrorComponent
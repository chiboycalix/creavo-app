import React from 'react'
import { TooltipProps } from 'recharts'

interface ChartContainerProps {
  children: React.ReactNode
  config: {
    [key: string]: {
      label: string
      color: string
    }
  }
  className?: string
}

export const ChartContainer: React.FC<ChartContainerProps> = ({ children, config, className }) => {
  return (
    <div className={className}>
      {children}
    </div>
  )
}

type ChartTooltipProps = TooltipProps<number, string> & {
  formatter?: (value: number, name: string, props: any) => [string, string]
}

export const ChartTooltip: React.FC<ChartTooltipProps> = ({ active, payload, label, formatter }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 rounded shadow">
        <p className="text-sm font-semibold">{`Period ${label}`}</p>
        {payload.map((entry, index) => {
          const formattedValue = formatter 
            ? formatter(entry.value as number, entry.name as string, entry.payload)
            : [entry.value, entry.name];
          return (
            <p key={index} className="text-sm">
              {`${formattedValue[1]}: ${formattedValue[0]}`}
            </p>
          );
        })}
      </div>
    )
  }

  return null
}

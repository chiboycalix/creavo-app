import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ChartHeaderProps {
  title: string
  showCourseFilter?: boolean
}

export function ChartHeader({ title, showCourseFilter = false }: ChartHeaderProps) {
  return (
    <div className="flex items-center justify-between pb-4">
      <h2 className="text-lg ml-10 font-semibold">{title}</h2>
      <div className="flex gap-2">
        {showCourseFilter && (
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              <SelectItem value="react">React Fundamentals</SelectItem>
              <SelectItem value="nextjs">Next.js Masters</SelectItem>
              <SelectItem value="typescript">TypeScript Pro</SelectItem>
            </SelectContent>
          </Select>
        )}
        <Select defaultValue="month">
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Last 30 days</SelectItem>
            <SelectItem value="quarter">Last 60 days</SelectItem>
            <SelectItem value="year">Last 90 days</SelectItem>
            <SelectItem value="quarter">Last year</SelectItem>

          </SelectContent>
        </Select>
      </div>
    </div>
  )
}


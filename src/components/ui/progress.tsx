import * as React from "react"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value?: number
    max?: number
    fill?: string
  }
>(({ className, value, max = 100, fill, ...props }, ref) => {
  const percentage = value != null ? Math.min(Math.max(value, 0), max) : 0
  const progressPercentage = (percentage / max) * 100

  return (
    <div
      ref={ref}
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
        className
      )}
      {...props}
    >
      <div
        className={cn("h-full w-full flex-1 bg-primary transition-all", fill)}
        style={{ transform: `translateX(-${100 - progressPercentage}%)` }}
      />
    </div>
  )
})
Progress.displayName = "Progress"

export { Progress }

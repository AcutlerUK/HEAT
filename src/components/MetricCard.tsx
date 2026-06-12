import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ArrowDown, ArrowUp } from "@phosphor-icons/react"

interface MetricCardProps {
  label: string
  value: string
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  className?: string
  valueClassName?: string
}

export function MetricCard({ 
  label, 
  value, 
  trend, 
  trendValue, 
  className,
  valueClassName 
}: MetricCardProps) {
  return (
    <Card className={cn("p-6", className)}>
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="flex flex-col gap-1">
          <p className={cn(
            "text-3xl font-semibold tabular-nums",
            valueClassName
          )}>
            {value}
          </p>
          {trend && trendValue && (
            <div className={cn(
              "flex items-center gap-1 text-sm font-medium",
              trend === "up" && "text-destructive",
              trend === "down" && "text-success",
              trend === "neutral" && "text-muted-foreground"
            )}>
              {trend === "up" && <ArrowUp size={16} weight="bold" />}
              {trend === "down" && <ArrowDown size={16} weight="bold" />}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
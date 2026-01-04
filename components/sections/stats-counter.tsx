"use client"

import { CounterAnimation } from "@/components/animations/counter-animation"

interface StatsCounterProps {
  value: number
  suffix: string
}

export function StatsCounter({ value, suffix }: StatsCounterProps) {
  return <CounterAnimation value={value} suffix={suffix} />
}

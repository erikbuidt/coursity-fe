import { Input } from '../ui/input'
import type { InputHTMLAttributes, ReactNode } from 'react'

interface IconInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon: ReactNode
  containerClassName?: string
}

export default function IconInput({
  icon,
  containerClassName = '',
  className = '',
  ...props
}: IconInputProps) {
  return (
    <div
      className={`flex items-center w-full max-w-md rounded-lg border bg-background text-foreground ${containerClassName}`}
    >
      <div className="flex items-center px-2 text-muted-foreground">{icon}</div>
      <Input
        {...props}
        className={`flex-1 rounded-l-none rounded-r-lg border-0 bg-transparent py-2 pr-4 text-sm focus:outline-none focus:ring-0 ${className}`}
      />
    </div>
  )
}

import React from 'react'

interface CircleProgressProps {
  progress: number // 0 to 100
  size?: number
  strokeWidth?: number
  colorClass?: string // Tailwind class for stroke color
  bgColorClass?: string // Tailwind class for background stroke
  textColorClass?: string // Tailwind class for text color
  textSizeClass?: string // Tailwind class for text color
  text?: string
}

const CircleProgress: React.FC<CircleProgressProps> = ({
  progress,
  size = 120,
  strokeWidth = 10,
  colorClass = 'stroke-blue-500',
  bgColorClass = 'stroke-gray-200',
  textColorClass = 'text-gray-700',
  textSizeClass = 'text-xs',
  text,
}) => {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className={bgColorClass}
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={colorClass}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <span className={`absolute ${textSizeClass} font-semibold ${textColorClass}`}>
        {text ?? `${Math.round(progress)}%`}
      </span>
    </div>
  )
}

export default CircleProgress

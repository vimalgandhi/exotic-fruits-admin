'use client'

import { useDebounce } from '@/hooks/useDebounce'
import { Search } from 'lucide-react'
import { useState, useEffect } from 'react'

interface SearchInputProps {
  placeholder?: string
  value: string
  onChange: (value: string) => void
  debounceMs?: number
}

export function SearchInput({
  placeholder = 'Search...',
  value,
  onChange,
  debounceMs = 500,
}: SearchInputProps) {
  const [input, setInput] = useState(value)
  const debouncedValue = useDebounce(input, debounceMs)

  useEffect(() => {
    onChange(debouncedValue)
  }, [debouncedValue, onChange])

  useEffect(() => {
    setInput(value)
  }, [value])

  return (
    <div className="relative">
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        type="text"
        placeholder={placeholder}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
      />
    </div>
  )
}

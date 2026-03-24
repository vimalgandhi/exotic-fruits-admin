'use client'

import { useDebounce } from '@/hooks/useDebounce'
import { Search } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

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
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  useEffect(() => {
    onChangeRef.current(debouncedValue)
  }, [debouncedValue])

  useEffect(() => {
    setInput(value)
  }, [value])

  return (
    <div className="relative w-full">
      <Search
        size={16}
        className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        type="text"
        placeholder={placeholder}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full rounded-lg border border-gray-300 py-1.5 sm:py-2 pl-8 sm:pl-10 pr-3 sm:pr-4 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
      />
    </div>
  )
}

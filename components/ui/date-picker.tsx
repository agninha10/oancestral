'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar as CalendarIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export interface DatePickerProps {
    label: string
    value?: string
    onChange?: (value: string) => void
    error?: string
    disabled?: boolean
    id?: string
}

export function DatePicker({
    label,
    value,
    onChange,
    error,
    disabled,
    id,
}: DatePickerProps) {
    const selectedDate = React.useMemo(() => {
        if (!value) return undefined
        const parsed = new Date(value)
        return Number.isNaN(parsed.getTime()) ? undefined : parsed
    }, [value])

    const handleSelect = (date?: Date) => {
        if (!date) return
        const formatted = format(date, 'yyyy-MM-dd')
        onChange?.(formatted)
    }

    return (
        <div className="space-y-2">
            <label
                htmlFor={id}
                className="text-sm text-muted-foreground"
            >
                {label}
            </label>

            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id={id}
                        type="button"
                        variant="outline"
                        disabled={disabled}
                        className={cn(
                            'w-full justify-between text-left font-normal',
                            !selectedDate && 'text-muted-foreground',
                            error && 'border-red-500 focus-visible:ring-red-500'
                        )}
                    >
                        {selectedDate
                            ? format(selectedDate, "dd 'de' MMMM 'de' yyyy", {
                                  locale: ptBR,
                              })
                            : 'Selecione uma data'}
                        <CalendarIcon className="ml-2 h-4 w-4 opacity-60" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleSelect}
                        initialFocus
                        disabled={(date) => date > new Date()}
                    />
                </PopoverContent>
            </Popover>

            {error && (
                <p className="text-sm text-red-500 animate-in fade-in slide-in-from-top-1 duration-200">
                    {error}
                </p>
            )}
        </div>
    )
}

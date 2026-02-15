'use client'

import * as React from 'react'
import { IMaskInput } from 'react-imask'
import { Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface DateInputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
    label: string
    error?: string
    value?: string
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
}

const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
    ({ className, label, error, id, value, onChange, onBlur, disabled, ...props }, ref) => {
        const [isFocused, setIsFocused] = React.useState(false)
        const [internalValue, setInternalValue] = React.useState(value || '')
        const [showDatePicker, setShowDatePicker] = React.useState(false)

        const inputId = id || 'birthdate'
        const datePickerId = `${inputId}-picker`

        // Sync internal value with external value
        React.useEffect(() => {
            if (value !== undefined) {
                setInternalValue(value)
            }
        }, [value])

        const handleAccept = (maskedValue: string, maskRef: any) => {
            setInternalValue(maskedValue)

            if (onChange) {
                const syntheticEvent = {
                    target: {
                        name: props.name,
                        value: maskedValue,
                    },
                    currentTarget: {
                        name: props.name,
                        value: maskedValue,
                    },
                } as React.ChangeEvent<HTMLInputElement>

                onChange(syntheticEvent)
            }
        }

        const handleDatePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            // Convert YYYY-MM-DD to DD/MM/YYYY
            const isoDate = e.target.value
            if (isoDate) {
                const [year, month, day] = isoDate.split('-')
                const brazilianDate = `${day}/${month}/${year}`
                setInternalValue(brazilianDate)

                if (onChange) {
                    const syntheticEvent = {
                        target: {
                            name: props.name,
                            value: brazilianDate,
                        },
                        currentTarget: {
                            name: props.name,
                            value: brazilianDate,
                        },
                    } as React.ChangeEvent<HTMLInputElement>

                    onChange(syntheticEvent)
                }
            }
        }

        const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(false)
            if (onBlur) {
                onBlur(e)
            }
        }

        const handleFocus = () => {
            setIsFocused(true)
        }

        const hasValue = internalValue && internalValue.replace(/\D/g, '').length > 0

        // Convert DD/MM/YYYY to YYYY-MM-DD for date picker
        const getDatePickerValue = () => {
            if (!internalValue || internalValue.replace(/\D/g, '').length < 8) return ''
            const [day, month, year] = internalValue.split('/')
            if (!day || !month || !year) return ''
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
        }

        return (
            <div className="relative w-full">
                <div className="relative">
                    <IMaskInput
                        mask="00/00/0000"
                        id={inputId}
                        inputRef={ref}
                        value={internalValue}
                        onAccept={handleAccept}
                        onBlur={handleBlur}
                        onFocus={handleFocus}
                        disabled={disabled}
                        {...props}
                        className={cn(
                            'peer w-full px-4 pt-6 pb-2 pr-12 border rounded-lg',
                            'bg-background text-foreground',
                            'transition-all duration-200',
                            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
                            'placeholder-transparent',
                            error && 'border-red-500 focus:ring-red-500',
                            !error && 'border-border hover:border-primary/50',
                            disabled && 'opacity-50 cursor-not-allowed',
                            className
                        )}
                        placeholder=" "
                    />

                    {/* Calendar Icon Button */}
                    <button
                        type="button"
                        onClick={() => setShowDatePicker(!showDatePicker)}
                        disabled={disabled}
                        className={cn(
                            'absolute right-3 top-1/2 -translate-y-1/2',
                            'p-2 rounded-md transition-colors',
                            'hover:bg-muted',
                            disabled && 'opacity-50 cursor-not-allowed'
                        )}
                        tabIndex={-1}
                    >
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                    </button>

                    {/* Hidden Native Date Picker */}
                    {showDatePicker && (
                        <input
                            type="date"
                            id={datePickerId}
                            value={getDatePickerValue()}
                            onChange={handleDatePickerChange}
                            onBlur={() => setShowDatePicker(false)}
                            disabled={disabled}
                            className={cn(
                                'absolute inset-0 w-full h-full opacity-0 cursor-pointer',
                                'z-10'
                            )}
                            autoFocus
                        />
                    )}

                    <label
                        htmlFor={inputId}
                        className={cn(
                            'absolute left-4 transition-all duration-200 pointer-events-none',
                            'text-muted-foreground',
                            'top-4 text-base',
                            'peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary',
                            'peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs',
                            error && 'peer-focus:text-red-500',
                            (isFocused || hasValue) && 'top-2 text-xs',
                            isFocused && !error && 'text-primary'
                        )}
                    >
                        {label}
                    </label>
                </div>

                {error && (
                    <p className="text-sm text-red-500 mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                        {error}
                    </p>
                )}
            </div>
        )
    }
)

DateInput.displayName = 'DateInput'

export { DateInput }

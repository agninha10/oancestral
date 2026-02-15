'use client'

import * as React from 'react'
import { IMaskInput } from 'react-imask'
import { cn } from '@/lib/utils'

export interface PhoneInputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
    label: string
    error?: string
    value?: string
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
    ({ className, label, error, id, value, onChange, onBlur, disabled, ...props }, ref) => {
        const [isFocused, setIsFocused] = React.useState(false)
        const [internalValue, setInternalValue] = React.useState(value || '')

        const inputId = id || 'whatsapp'

        // Sync internal value with external value
        React.useEffect(() => {
            if (value !== undefined) {
                setInternalValue(value)
            }
        }, [value])

        const handleAccept = (maskedValue: string, maskRef: any) => {
            setInternalValue(maskedValue)

            if (onChange) {
                // Create a synthetic event that React Hook Form expects
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

        return (
            <div className="relative w-full">
                <div className="relative">
                    <IMaskInput
                        mask="(00) 00000-0000"
                        id={inputId}
                        inputRef={ref}
                        value={internalValue}
                        onAccept={handleAccept}
                        onBlur={handleBlur}
                        onFocus={handleFocus}
                        disabled={disabled}
                        {...props}
                        className={cn(
                            'peer w-full px-4 pt-6 pb-2 border rounded-lg',
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

PhoneInput.displayName = 'PhoneInput'

export { PhoneInput }

'use client'

import * as React from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface FloatingLabelInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string
    error?: string
}

const FloatingLabelInput = React.forwardRef<HTMLInputElement, FloatingLabelInputProps>(
    ({ className, label, error, type, id, ...props }, ref) => {
        const [showPassword, setShowPassword] = React.useState(false)
        const [isFocused, setIsFocused] = React.useState(false)
        const [hasValue, setHasValue] = React.useState(false)

        const inputId = id || label.toLowerCase().replace(/\s/g, '-')
        const isPassword = type === 'password'
        const inputType = isPassword && showPassword ? 'text' : type

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setHasValue(e.target.value.length > 0)
            props.onChange?.(e)
        }

        return (
            <div className="relative w-full">
                <div className="relative">
                    <input
                        id={inputId}
                        ref={ref}
                        type={inputType}
                        className={cn(
                            'peer w-full px-4 pt-6 pb-2 border rounded-lg',
                            'bg-background text-foreground',
                            'transition-all duration-200',
                            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
                            'placeholder-transparent',
                            error && 'border-red-500 focus:ring-red-500',
                            !error && 'border-border hover:border-primary/50',
                            isPassword && 'pr-12',
                            className
                        )}
                        placeholder=" "
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        onChange={handleChange}
                        {...props}
                    />

                    <label
                        htmlFor={inputId}
                        className={cn(
                            'absolute left-4 transition-all duration-200 pointer-events-none',
                            'text-muted-foreground',
                            // Default position (when empty and not focused)
                            'top-4 text-base',
                            // Floating position (when focused or has value)
                            'peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary',
                            'peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs',
                            error && 'peer-focus:text-red-500',
                            (isFocused || hasValue) && 'top-2 text-xs',
                            isFocused && !error && 'text-primary'
                        )}
                    >
                        {label}
                    </label>

                    {isPassword && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            tabIndex={-1}
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                            ) : (
                                <Eye className="h-5 w-5" />
                            )}
                        </button>
                    )}
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

FloatingLabelInput.displayName = 'FloatingLabelInput'

export { FloatingLabelInput }

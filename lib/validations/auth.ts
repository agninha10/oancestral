import { z } from 'zod'

// Helper to remove non-numeric characters from phone
const normalizePhone = (phone: string) => phone.replace(/\D/g, '')

// Helper to parse DD/MM/YYYY to Date
const parseBrazilianDate = (dateStr: string): Date | null => {
    const [day, month, year] = dateStr.split('/').map(Number)
    if (!day || !month || !year) return null

    // Month is 0-indexed in JavaScript Date
    const date = new Date(year, month - 1, day)

    // Validate the date is valid
    if (
        date.getDate() !== day ||
        date.getMonth() !== month - 1 ||
        date.getFullYear() !== year
    ) {
        return null
    }

    return date
}

// Helper to calculate age
const calculateAge = (birthDate: Date): number => {
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
    }

    return age
}

// Register Schema
export const registerSchema = z.object({
    name: z
        .string()
        .min(3, 'Nome deve ter pelo menos 3 caracteres')
        .max(100, 'Nome muito longo')
        .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras'),

    email: z
        .string()
        .min(1, 'E-mail é obrigatório')
        .email('E-mail inválido')
        .toLowerCase(),

    whatsapp: z
        .string()
        .transform((val) => val === '' ? undefined : val)
        .optional()
        .refine(
            (val) => !val || /^\(\d{2}\)\s?\d{4,5}-?\d{4}$/.test(val) || /^\d{10,11}$/.test(val),
            'WhatsApp inválido'
        ),

    birthdate: z
        .string()
        .min(1, 'Data de nascimento é obrigatória')
        .refine(
            (val) => {
                // Accept both DD/MM/YYYY and ISO string formats
                const isBrazilianFormat = /^\d{2}\/\d{2}\/\d{4}$/.test(val)
                const isISOFormat = /^\d{4}-\d{2}-\d{2}/.test(val)
                return isBrazilianFormat || isISOFormat
            },
            'Formato deve ser DD/MM/AAAA'
        )
        .refine(
            (val) => {
                // Try parsing as Brazilian date first
                if (/^\d{2}\/\d{2}\/\d{4}$/.test(val)) {
                    const date = parseBrazilianDate(val)
                    return date !== null
                }
                // Otherwise try as ISO date
                const date = new Date(val)
                return !isNaN(date.getTime())
            },
            'Data inválida'
        )
        .refine(
            (val) => {
                let date: Date | null = null

                // Parse based on format
                if (/^\d{2}\/\d{2}\/\d{4}$/.test(val)) {
                    date = parseBrazilianDate(val)
                } else {
                    date = new Date(val)
                }

                if (!date || isNaN(date.getTime())) return false
                const age = calculateAge(date)
                return age >= 18
            },
            'Você deve ter pelo menos 18 anos'
        )
        .transform((val) => {
            // If already ISO, return as-is
            if (/^\d{4}-\d{2}-\d{2}/.test(val)) {
                return val
            }
            // Otherwise convert from DD/MM/YYYY to ISO
            const date = parseBrazilianDate(val)
            return date ? date.toISOString() : val
        }),

    password: z
        .string()
        .min(8, 'Senha deve ter pelo menos 8 caracteres')
        .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
        .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
        .regex(/[0-9]/, 'Senha deve conter pelo menos um número'),

    terms: z
        .boolean()
        .refine((val) => val === true, 'Você deve aceitar os termos de uso'),
})

export type RegisterFormData = z.infer<typeof registerSchema>

// Login Schema
export const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'E-mail é obrigatório')
        .email('E-mail inválido')
        .toLowerCase(),

    password: z
        .string()
        .min(1, 'Senha é obrigatória'),
})

export type LoginFormData = z.infer<typeof loginSchema>

// Password Reset Schema
export const passwordResetSchema = z.object({
    email: z
        .string()
        .min(1, 'E-mail é obrigatório')
        .email('E-mail inválido')
        .toLowerCase(),
})

export type PasswordResetFormData = z.infer<typeof passwordResetSchema>

// Update Password Schema (for reset flow)
export const updatePasswordSchema = z.object({
    password: z
        .string()
        .min(8, 'Senha deve ter pelo menos 8 caracteres')
        .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
        .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
        .regex(/[0-9]/, 'Senha deve conter pelo menos um número'),

    confirmPassword: z
        .string()
        .min(1, 'Confirmação de senha é obrigatória'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
})

export type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>

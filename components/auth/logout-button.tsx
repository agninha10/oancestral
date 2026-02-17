'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface LogoutButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  className?: string
  showIcon?: boolean
  showText?: boolean
}

export function LogoutButton({
  variant = 'outline',
  size = 'default',
  className = '',
  showIcon = true,
  showText = true,
}: LogoutButtonProps) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        // Limpar dados do cliente
        localStorage.clear()
        sessionStorage.clear()

        // Aguardar um pouco para garantir que o cookie foi deletado
        await new Promise((resolve) => setTimeout(resolve, 300))

        // Redirecionar para login
        router.push('/auth/login')
        
        // Forçar reload para limpar qualquer cache
        window.location.href = '/auth/login'
      } else {
        console.error('Logout response not ok:', response.status)
        alert('Erro ao fazer logout. Tente novamente.')
      }
    } catch (error) {
      console.error('Logout failed:', error)
      alert('Erro ao fazer logout. Tente novamente.')
    }
  }

  return (
    <Button
      onClick={handleLogout}
      variant={variant}
      size={size}
      className={`flex items-center gap-2 ${className}`}
    >
      {showIcon && <LogOut className="h-4 w-4" />}
      {showText && 'Sair'}
    </Button>
  )
}

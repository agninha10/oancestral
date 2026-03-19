'use client'

import { useEffect } from 'react'
import { logActivity } from '@/lib/activity-log'

interface ActivityTrackerProps {
  userId: string
  action: string
  resource?: string
}

export function ActivityTracker({ userId, action, resource }: ActivityTrackerProps) {
  useEffect(() => {
    // Log activity on component mount
    const logIt = async () => {
      try {
        const response = await fetch('/api/activity-log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action, resource }),
        })
        if (!response.ok) {
          console.error('Failed to log activity')
        }
      } catch (error) {
        console.error('Error logging activity:', error)
      }
    }

    logIt()
  }, [action, resource])

  return null
}

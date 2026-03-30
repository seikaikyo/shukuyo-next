'use client'

import { useState, useEffect, useCallback } from 'react'

interface AuthUser {
  sub: string
  name?: string
  picture?: string
}

interface AuthState {
  isAuthenticated: boolean
  user: AuthUser | null
  isLoading: boolean
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  })

  useEffect(() => {
    fetch('/api/logto/user')
      .then((res) => {
        if (!res.ok) throw new Error('Not authenticated')
        return res.json()
      })
      .then((user: AuthUser) => {
        setState({ isAuthenticated: true, user, isLoading: false })
      })
      .catch(() => {
        setState({ isAuthenticated: false, user: null, isLoading: false })
      })
  }, [])

  const signIn = useCallback(() => {
    window.location.href = '/api/logto/sign-in'
  }, [])

  const signOut = useCallback(() => {
    window.location.href = '/api/logto/sign-out'
  }, [])

  return { ...state, signIn, signOut }
}

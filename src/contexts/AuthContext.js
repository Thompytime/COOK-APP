// src/contexts/AuthContext.js
import React, { createContext, useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export const AuthContext = createContext()

const getInitialUser = async (setUser, setUsername, setLoading) => {
  const { data, error } = await supabase.auth.getUser()
  const currentUser = data?.user ?? null
  setUser(currentUser)

  if (currentUser && !error) {
    // Wait a bit before querying DB — helps avoid race condition
    setTimeout(async () => {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', currentUser.id)
        .single()

      if (!profileError && profileData?.username) {
        setUsername(profileData.username)
      }
    }, 1000)
  }

  setLoading(false)
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState(null)

  useEffect(() => {
    getInitialUser(setUser, setUsername, setLoading)

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user ?? null
        setUser(currentUser)

        if (currentUser) {
          setTimeout(async () => {
            const { data: profileData, error } = await supabase
              .from('profiles')
              .select('username')
              .eq('id', currentUser.id)
              .single()

            if (!error && profileData?.username) {
              setUsername(profileData.username)
            }
          }, 1000)
        }

        setLoading(false)
      }
    )

    // Refresh session when user returns to tab
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        const { data } = await supabase.auth.refreshSession()
        const currentUser = data.session?.user ?? null
        setUser(currentUser)

        if (currentUser) {
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', currentUser.id)
            .single()

          if (!error && profileData?.username) {
            setUsername(profileData.username)
          }
        }

        setLoading(false)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleVisibilityChange)

    return () => {
      authListener.subscription.unsubscribe()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleVisibilityChange)
    }
  }, [])

  const value = { user, loading, username }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
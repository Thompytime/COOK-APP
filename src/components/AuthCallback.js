// src/components/AuthCallback.js
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

const AuthCallback = () => {
  const navigate = useNavigate()

  React.useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data?.user) {
        navigate('/')
      }
    }

    checkUser()
  }, [navigate])

  return (
    <div style={{ textAlign: 'center', marginTop: '5rem' }}>
      <h2>Logging you in...</h2>
      <p>Please wait while we verify your account.</p>
    </div>
  )
}

export default AuthCallback
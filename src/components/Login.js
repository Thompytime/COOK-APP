// src/components/Login.js
import React from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (!error) {
      navigate('/')
    } else {
      alert(error.message)
    }
  }

  return (
    <div className="login-form">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="current-password" // On Login
      />
        <button type="submit">Login</button>
      </form>

      <p>
        Don't have an account?{' '}
        <button onClick={() => navigate('/register')} style={{ background: 'none', color: '#3498db', cursor: 'pointer' }}>
          Create new account
        </button>
      </p>
    </div>
  )
}

export default Login
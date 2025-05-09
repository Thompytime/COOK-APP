// src/components/Register.js
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

const Register = () => {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [username, setUsername] = React.useState('')
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    })

    if (error) {
      alert(`Registration failed: ${error.message}`)
      return
    }

    if (data?.user) {
      alert('Check your email to confirm your account')
      navigate('/login')
    } else {
      alert('Registration successful! Please check your inbox for confirmation.')
      navigate('/login')
    }
  }

  return (
    <div className="registration-form">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete="username"
        />
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
          autoComplete="new-password"
        />

        <button type="submit" className="rate-meals-button">
          Sign Up
        </button>
      </form>

      <p>
        Already have an account?{' '}
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="rate-meals-button"
          style={{ marginLeft: 0 }}
        >
          Log in
        </button>
      </p>
    </div>
  )
}

export default Register
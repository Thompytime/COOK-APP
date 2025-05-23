import React from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = React.useContext(AuthContext)

  if (loading) return <div>Loading...</div>
  if (!user) return <Navigate to="/login" />

  return children
}

export default ProtectedRoute
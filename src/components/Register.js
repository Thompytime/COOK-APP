// src/components/Register.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const Register = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [username, setUsername] = React.useState(''); // Keep username state if needed elsewhere, or remove if only for profile
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Step 1: Sign up the user
    // We pass the username in the 'options.data' field.
    // This data will be available in the 'new' record inside a database trigger function.
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username, // Pass username here
        },
      },
    });

    if (error) {
      alert(`Registration failed: ${error.message}`);
      return;
    }

    // If signUp is successful (data.user exists), prompt for email confirmation.
    // The profile creation logic is now removed from here.
    if (data?.user) {
      alert('Check your email for confirmation!');
      navigate('/login'); // Redirect to login page after sign up request
    } else if (!error) {
       // Handle cases where sign up doesn't return a user but also no error (might indicate email confirmation needed)
       alert('Check your email for confirmation link!');
       navigate('/login');
    }
  };

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
        <button type="submit">Sign Up</button>
      </form>

      <p>
        Already have an account?{' '}
        <button onClick={() => navigate('/login')} style={{ background: 'none', color: '#3498db', cursor: 'pointer' }}>
          Log in
        </button>
      </p>
    </div>
  );
};

export default Register;
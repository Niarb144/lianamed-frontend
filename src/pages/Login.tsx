import React, { useState } from 'react';
import { api, setAuthToken } from '../api/api';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;

      // Save authentication info
      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);
      setAuthToken(token);

      // Redirect based on user role
      switch (user.role) {
        case 'admin':
          navigate('/admin-dashboard');
          break;
        case 'doctor':
          navigate('/doctor-dashboard');
          break;
        case 'nurse':
          navigate('/nurse-dashboard');
          break;
        case 'patient':
          navigate('/products');
          break;
        default:
          navigate('/products'); // fallback route
      }
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="container login">
      <h2>Login</h2>
      <form onSubmit={submit} style={{ maxWidth: 400 }} className='login-form'>
        <div style={{ marginBottom: 8 }}>
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />
        </div>
        <button className="btn" type="submit">
          Login
        </button>
      </form>
      <p>Do not have an account? <a href="/register">Sign up</a></p>
    </div>
  );
}

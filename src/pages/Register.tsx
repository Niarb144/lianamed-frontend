import React, { useState } from 'react'
import { api } from '../api/api'
import { useNavigate } from 'react-router-dom'

export default function Register(){
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    try{
      await api.post('/auth/register', { name, email, password })
      alert('Registered! Please login.')
      navigate('/')
    }catch(err:any){
      alert(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="container">
      <h2>Register</h2>
      <form onSubmit={submit} style={{maxWidth:400}}>
        <div style={{marginBottom:8}}>
          <input placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} className="input" />
        </div>
        <div style={{marginBottom:8}}>
          <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="input" />
        </div>
        <div style={{marginBottom:8}}>
          <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} className="input" />
        </div>
        <button className="btn" type="submit">Register</button>
      </form>
    </div>
  )
}

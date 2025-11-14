import React, { useEffect, useState } from 'react'
import { api, setAuthToken } from '../api/api'

export default function Dashboard(){
  const [me, setMe] = useState<any>(null)

  useEffect(()=>{
    const token = localStorage.getItem('token')
    if(token) setAuthToken(token)
    api.get('/users/me').then(res=>{ 
      setMe(res.data.user)
    }).catch(err=>{
      console.error(err)
      setMe(null)
    })
  },[])

  return (
    <div className="container">
      <h2>Dashboard</h2>
      {me ? (<div>
        <p><strong>Name:</strong> {me.name}</p>
        <p><strong>Email:</strong> {me.email}</p>
        <p><strong>Role:</strong> {me.role}</p>
      </div>) : (
        <p>Please login to view your dashboard.</p>
      )}
    </div>
  )
}

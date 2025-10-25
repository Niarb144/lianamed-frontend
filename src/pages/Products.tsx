import React, { useEffect, useState } from 'react'
import { api } from '../api/api'
import { logout } from '../utils/logout'
import { useNavigate } from 'react-router-dom';

interface Product {
  _id?: string;
  id?: number;
  name: string;
  price: number;
  description?: string;
  image?: string;
}

export default function Products(){
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const navigate = useNavigate();

  useEffect(()=> {
    // For demo we use static list if API fails
    api.get('/products').then(res=>{
      setProducts(res.data)
    }).catch(err=>{
      console.error('Products API error, using fallback', err.message)
      setProducts([
        { id:1, name:'Digital Thermometer', price:1200, description:'Accurate and fast temperature readings.', image:'https://images.unsplash.com/photo-1616394584738-8c8d7e1ad23d?auto=format&fit=crop&w=800&q=60' },
        { id:2, name:'Blood Pressure Monitor', price:4500, description:'Automatic arm-type BP monitor with cuff.', image:'https://images.unsplash.com/photo-1588776814546-ec7f1c1a62e9?auto=format&fit=crop&w=800&q=60' },
        { id:3, name:'Stethoscope', price:3000, description:'High-quality stethoscope for professionals.', image:'https://images.unsplash.com/photo-1588776814156-9d4aee9b14e0?auto=format&fit=crop&w=800&q=60' },
        { id:4, name:'Pulse Oximeter', price:1800, description:'Measures oxygen levels and heart rate.', image:'https://images.unsplash.com/photo-1588774069169-3a9bdf92cc72?auto=format&fit=crop&w=800&q=60' }
      ])
    })
  },[])

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="container">
      <header className="header">
        <div className="brand">LianaMed Store</div>
        <div className="nav">
          <input className="input" placeholder="Search products..." value={search} onChange={e=>setSearch(e.target.value)} />
          <div className="userIcon">U</div>
        </div>
        <button
          className="btn btn-logout"
          onClick={() => logout(navigate)}
        >
          Logout
        </button>
      </header>

      <main>
        <div className="grid">
          {filtered.map((p, idx)=>(
            <div className="card" key={p._id || p.id || idx}>
              <img src={p.image} alt={p.name} />
              <h4>{p.name}</h4>
              <p>{p.description}</p>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:8}}>
                <strong>KES {p.price}</strong>
                <button className="btn" onClick={()=>alert(`Purchased ${p.name} for KES ${p.price}`)}>Buy Now</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

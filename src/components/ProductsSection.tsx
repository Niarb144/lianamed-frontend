import React, { useEffect, useState } from 'react'
import { api } from '../api/api'
import { useNavigate } from 'react-router-dom';

interface Medicine {
  _id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
}

export default function Products(){
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [search, setSearch] = useState('')
  const navigate = useNavigate();

  useEffect(()=> {
    // For demo we use static list if API fails
    api.get('/medicines').then(res=>{
      setMedicines(res.data)
    }).catch(err=>{
      console.error('Products API error, using fallback', err.message)
    })
  },[])

  const filtered = medicines.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

  return (
  
      <main>
        <div className="grid">
          <div className="nav">
          <input className="input" placeholder="Search products..." value={search} onChange={e=>setSearch(e.target.value)} />
          <div className="userIcon">U</div>
        </div>
          {filtered.map((p, idx)=>(
            <div className="card" key={p._id || idx}>
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
    
  )
}

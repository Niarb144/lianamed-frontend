import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Products from './pages/Products'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'
import PharmacistDashboard from './pages/PharmacistDashboard'
import AddMedicine from './pages/AddMedicine'
import MedicineList from './pages/MedicineList'

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/products' element={<Products/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/pharmacist-dashboard" element={<PharmacistDashboard />} />
        <Route path="/add-medicine" element={<AddMedicine />} />
        <Route path="/medicine-list" element={<MedicineList />} />

      </Routes>

    </BrowserRouter>
  )
}

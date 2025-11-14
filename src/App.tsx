import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Products from './pages/Products'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import UserPage from './pages/UserPage'
import AdminDashboard from './pages/AdminDashboard'
import PharmacistDashboard from './pages/PharmacistDashboard'
import AddMedicine from './pages/AddMedicine'
import MedicineList from './pages/MedicineList'
import Cart from './pages/Cart'
import MyPrescriptions from './pages/MyPrescriptions'
import UploadPrescription from './pages/UploadPrescription'
import AllPrescriptions from './pages/AllPrescriptions'
import MyOrders from './pages/MyOrders'
import AllOrders from './pages/AllOrders'


export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/home' element={<UserPage />}/>
        <Route path='/products' element={<Products/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/pharmacist-dashboard" element={<PharmacistDashboard />} />
        <Route path="/add-medicine" element={<AddMedicine />} />
        <Route path="/medicine-list" element={<MedicineList />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/prescriptions" element={<MyPrescriptions />} />
        <Route path="addPrescription" element={<UploadPrescription />} />
        <Route path='/allPrescriptions' element={<AllPrescriptions />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/all-orders" element={<AllOrders />} />



      </Routes>

    </BrowserRouter>
  )
}

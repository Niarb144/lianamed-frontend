import React from 'react'
import Navigation from '../components/Navigation'
import UserNav from '../components/UserNav'
import AllOrders from './AllOrders'
import AllPrescriptions from './AllPrescriptions'
import Footer from '../components/Footer'

const UserPage = () => {
  return (
    <main>
      <UserNav />
      <a href='/home'> Buy Product</a>
      <AllPrescriptions />
      <AllOrders />
      <Footer /> 
    </main>
    
  )
}

export default UserPage
import React from 'react'
import Navigation from '../components/Navigation'
import UserNav from '../components/UserNav'
import Products from '../pages/Products'
import Footer from '../components/Footer'

const UserPage = () => {
  return (
    <div className='overflow-hidden'>
        <UserNav />
        <Products />
        <Footer />   
    </div>
  )
}

export default UserPage
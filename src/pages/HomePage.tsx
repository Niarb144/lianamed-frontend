import React from 'react'
import Navigation from '../components/Navigation'
import Hero from '../components/Hero'
import Products from '../pages/Products'
import ProductsSection from '../components/ProductsSection'
import Footer from '../components/Footer'

const HomePage = () => {
  return (
    <div className='overflow-hidden'>
        <Navigation />
        <Hero /> 
        <Products />
        <Footer />   
    </div>
  )
}

export default HomePage
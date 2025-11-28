import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'
import { CartProvider } from "./context/CartContext";
import ChatBot from './components/ChatBot';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
    <ChatBot />
  </React.StrictMode>
)

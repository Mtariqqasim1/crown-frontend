import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import CategoryPage from './pages/CategoryPage.jsx'
import ProductPage  from './pages/ProductPage.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx'
import AdminPanel   from './pages/admin/AdminPanel.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/"          element={<App />} />
      <Route path="/tricycle"  element={<CategoryPage category="tricycle"  title="Tricycles" />} />
      <Route path="/rideon"    element={<CategoryPage category="rideon"    title="Ride On Toys" />} />
      <Route path="/slider"    element={<CategoryPage category="slider"    title="Sliders & Climbers" />} />
      <Route path="/furniture" element={<CategoryPage category="furniture" title="Kids Furniture" />} />
      <Route path="/product"   element={<ProductPage />} />
      <Route path="/checkout"  element={<CheckoutPage />} />
      <Route path="/admin"     element={<AdminPanel />} />
    </Routes>
  </BrowserRouter>
)

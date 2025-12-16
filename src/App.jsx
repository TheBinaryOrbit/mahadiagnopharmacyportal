import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ProtectedRoute from './routes/ProtectedRoutes'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Wallet from './pages/Wallet'
import PaymentMethod from './pages/PaymentMethod'
import Profile from './pages/Profile'
import Register from './pages/Register'
import AddMedicine from './pages/AddMedicine'
import Medicine from './pages/Medicine'
import MedicineDetails from './pages/MedicineDetails'
import Order from './pages/Order'
import OrderDetails from './pages/OrderDetails'

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />


        <Route path='/add-medicine' element={<ProtectedRoute> <AddMedicine /> </ProtectedRoute>} />
        <Route path='/my-medicines' element={<ProtectedRoute> <Medicine /> </ProtectedRoute>} />
        <Route path='/medicine/:id' element={<ProtectedRoute> <MedicineDetails /> </ProtectedRoute>} />
        <Route path='/payment' element={<ProtectedRoute> <PaymentMethod /> </ProtectedRoute>} />      
        <Route path='/profile' element={<ProtectedRoute> <Profile /> </ProtectedRoute>} />
        <Route path='/dashboard' element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>} />
        <Route path='/orders' element={<ProtectedRoute> <Order /> </ProtectedRoute>} />
        <Route path='/orders/:id' element={<ProtectedRoute> <OrderDetails /> </ProtectedRoute>} />

        
        <Route path='/wallet' element={<ProtectedRoute> <Wallet /> </ProtectedRoute>} />
        

        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
    </>
  )
}

export default App

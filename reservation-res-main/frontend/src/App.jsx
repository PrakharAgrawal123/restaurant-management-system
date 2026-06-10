import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './Pages/Home/Home';
import NotFound from './Pages/NotFound/NotFound';
import Success from './Pages/Success/Success';
import Login from './Pages/Auth/Login';
import Register from './Pages/Auth/Register';
import ForgotPassword from './Pages/Auth/ForgotPassword';
import UserDashboard from './Pages/Dashboard/UserDashboard';
import AdminDashboard from './Pages/Dashboard/AdminDashboard';
import MenuPage from './Pages/Home/MenuPage';
import FoodDetails from './Pages/Home/FoodDetails';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css'

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/password/forgot' element={<ForgotPassword/>}/>
          <Route path='/menu' element={<MenuPage/>}/>
          <Route path='/menu/:id' element={<FoodDetails/>}/>
          
          <Route 
            path='/dashboard' 
            element={
              <ProtectedRoute>
                <UserDashboard/>
              </ProtectedRoute>
            }
          />
          
          <Route 
            path='/admin/dashboard' 
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard/>
              </ProtectedRoute>
            }
          />

          <Route path='/success' element={<Success/>}/>
          <Route path='*' element={<NotFound/>}/>
        </Routes>
        <Toaster position="top-center" reverseOrder={false} />
      </Router>
    </>
  )
}

export default App

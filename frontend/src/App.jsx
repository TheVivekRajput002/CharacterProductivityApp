import { useState } from 'react'
import Auth from "./pages/auth/Auth"
import Home from "./pages/Home"
import Tasks from "./pages/Tasks"
import Sidebar from "./components/Sidebar"
import './App.css'
import ProtectedRoute from './components/auth/ProtectedRoute'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <Router>
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <Routes>

        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/home" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/tasks" element={
          <ProtectedRoute>
            <Tasks />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  )
}

export default App

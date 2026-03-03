import { useState } from 'react'
import Auth from "./pages/auth/Auth"
import Home from "./pages/Home"
import Sidebar from "./components/Sidebar"
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <Router>
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  )
}

export default App

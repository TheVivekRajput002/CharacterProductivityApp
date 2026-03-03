import { useState } from 'react'
import Auth from "./pages/auth/Auth"
import Home from "./pages/Home"
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>

    </>
  )
}

export default App

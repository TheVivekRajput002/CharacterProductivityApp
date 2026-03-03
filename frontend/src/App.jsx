import { useState } from 'react'
import Auth from "./pages/auth/Auth"
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Auth />
      
    </>
  )
}

export default App

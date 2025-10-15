import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Login from "./pages/Login/Login"
import Home from './pages/Home/home'
import { ShaderGradientCanvas, ShaderGradient } from '@shadergradient/react'
import * as reactSpring from '@react-spring/three'
function App() {
  const [count, setCount] = useState(0)

  return (
     <div>
      <Home/>
     </div>
  )
}

export default App

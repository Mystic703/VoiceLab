import React from 'react'
import './Navbar.css'
import Logo from "../../assets/logo.svg"
const Navbar = () => {
  return (
    <div className='navbar'>   
        <div className="navbar-left">
            <img className='image' src={Logo} alt="" />
            <ul>
                <li>Overview</li>
                <li>Features</li>
                <li>Pricing</li>
                <li>About</li>
            </ul>
        </div>
        <div className="navbar-right">
            <button className='button'> Sign in</button>
        </div>
    </div>
    
  )
}

export default Navbar

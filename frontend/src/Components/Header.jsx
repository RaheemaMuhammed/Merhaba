import React from 'react'
import logo from '../assets/logo.png'
import { Link } from 'react-router-dom'
const Header = () => {
  return (
  
        <header>
    <nav className="bg-secondary border-gray-200 px-4 lg:px-6 py-2.5 w-screen">
        <div className="flex flex-wrap justify-between mt-2 items-center mx-auto max-w-screen-xl">
            <Link to={'/'}>
            
                <img src={logo} className="ml-5 h-10 sm:h-9" alt="Merhaba Logo" />
            </Link>
            
            
            <div className="flex items-center lg:order-2">
                <Link to={'/login'}>
                <p className="text-shiny bg-primary hover:shadow-lg hover:shadow-shiny focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2  focus:outline-none ">
         
                    Log in
                    </p>
                    </Link>
                    <Link to={'/signup'}>
                <p className="text-shiny bg-primary hover:shadow-lg hover:shadow-shiny focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2  focus:outline-none ">
         
                    Sign Up
                    </p>
                    </Link>
            </div>
            
        </div>
    </nav>
</header>
        
  )
}

export default Header
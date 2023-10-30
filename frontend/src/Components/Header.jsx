import React from 'react'
import logo from '../assets/logo.png'
const Header = () => {
  return (
  
        <header>
    <nav className="bg-secondary border-gray-200 px-4 lg:px-6 py-2.5 w-screen">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                <img src={logo} className="ml-5 h-10 sm:h-9" alt="Merhaba Logo" />
            
            
            <div className="flex items-center lg:order-2">
                <a href="#" className="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">Log in</a>
               
            </div>
            
        </div>
    </nav>
</header>
        
  )
}

export default Header
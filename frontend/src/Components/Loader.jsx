import React from 'react'
import Lottie from 'lottie-react'

import loader from '../assets/MLoader.json'
function Loader() {
  return( 
    <div className="flex items-center justify-center h-screen">
    <div className="w-64 h-64">
      <Lottie animationData={loader} />
    </div>
  </div>
  
  )
}

export default Loader
import React, { useState,useEffect } from 'react'
import logo from '../assets/logo.png'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { axiosInstance } from '../Axios/instanse'
import { useLoading } from '../CustomHooks/useLoading'
import {UserLogin,UserLogout} from '../Redux/UserSlice'
import { RiLogoutCircleLine } from "react-icons/ri";

import { CgProfile } from "react-icons/cg";
const Header = () => {
    const user = useSelector(state => state.UserReducer.user)
    const dispatch =useDispatch()
    const navigate=useNavigate()

    let location =useLocation();
    const [error, setError] = useState("");
   const {loading,setLoading} =useLoading()


  
    useEffect(() => {
    //   const values = queryString.parse(location.search);
    if(!user){
        const queryparams=new URLSearchParams(location.search)

        const code = queryparams.get('code') ? queryparams.get('code') : null;
    
        if (code) {
          onGogglelogin();
        }
    } 
    
    }, []);
  
    const googleLoginHandler = (code) => {
      return axiosInstance
        .get(`authentication/login/google/${code}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          setError(err);
          return err;
        });
    };
  
    const onGogglelogin = async () => {
      const response = await googleLoginHandler(location.search);
      if (response?.status === 200){
        toast.success(response?.message)
         setLoading(false)
        dispatch(UserLogin({
          refreshToken : response?.refresh_token,
          accessToken : response?.access_token,
          user: response?.username,
          pk: response?.pk,
       })) 
     
        navigate('/')
       
      }else {
        toast.error('something went wrong')
        setLoading(false)
        navigate('/')
      }
    }
  
    const handleLogout =() => {
        if (user){            
            dispatch(UserLogout())
            toast.success('Successfully Logged Out')         
        }navigate('/')
    }

  return (
  
        <nav className="bg-secondary  px-4 lg:px-6 py-2.5 sticky top-0 z-10">
        <div className="flex flex-wrap justify-between mt-2 items-center max-w-screen-xl">
            <Link to={'/'}>
            
                <img src={logo} className="ml-5 h-10 sm:h-9" alt="Merhaba Logo" />
            </Link>
            
            
        <div className="flex items-center lg:order-2">
                { user ?
                <>
                <p className='text-primary font-medium text-lg px-4 lg:px-5 py-2 lg:py-2.5 mr-2 '>Welcome {user ? user.toUpperCase() : ''}  !</p>     
                <p onClick={handleLogout} className="text-shiny cursor-pointer bg-primary hover:shadow-lg hover:shadow-shiny focus:ring-4 focus:ring-gray-300 font-medium p-1 rounded-lg text-sm mr-2  focus:outline-none ">
         <RiLogoutCircleLine size={23}/>
                    
                    </p>
                    {/* <p className='text-primary'>
                      <CgProfile size={40} fill=''/>
                    </p> */}
                    
                </> 
                
                :<>
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
                    </>
}
            </div>
            
        </div>
    </nav>
        
  )
}

export default Header
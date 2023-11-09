import React, { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { axiosInstance } from '../Axios/instanse'
import { toast } from 'react-toastify'
import { useLoading } from '../CustomHooks/useLoading'
import Loader from './Loader'
const Verification = () => {
    const {loading,setLoading} =useLoading()
    const location=useLocation()
    const queryparams=new URLSearchParams(location.search)
    const token=queryparams.get("token")
    const uid=queryparams.get("uid")
    const [success,setSuccess] =useState(false)
    useEffect(() => {
        setLoading(true)
        const verifyToken=async()=>{

        
            try {
                const response=await axiosInstance.post('authentication/verify/',{uid,token})
                console.log(response.data);
                if (response.data.status===200){
                    console.log(response);
                    setSuccess(true)
                    setLoading(false)

                }else{
                    setSuccess(false)
                    setLoading(false)
                }
                
            } catch (error) {
                console.log(error);
            }
        }
        verifyToken()
      
    }, [])
    
  return (
    loading?<Loader/> :
    <div className='p-3'>{
        success?<div className='mt-[10%] p-5 border-secondary border-2 w-fit mx-auto'>
        <p className='text-xl text-center'>Your Account has been verified.</p>
        <Link to={'/login'}>
        <p className='underline decoration-secondary text-center text-base'>Login here</p>
        </Link>
        </div>:
        <div className='mt-[10%] p-5 border-secondary border-2 w-fit mx-auto'>
        <p className='text-xl text-center'>Your verification link has been expired!!</p>
        
        <p className='mt-3 text-center text-base'>Please try after some time</p>
        
        </div>
    }
        

    </div>
  )
}

export default Verification
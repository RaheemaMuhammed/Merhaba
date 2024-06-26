import React,{useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLoading } from '../CustomHooks/useLoading'
import { useFormik } from 'formik'
import { loginSchema } from '../Validations/loginSchema'
import { axiosInstance } from '../Axios/instanse'
import {toast} from 'react-toastify'
import {useDispatch} from 'react-redux'
import {UserLogin} from '../Redux/UserSlice'
import Header from './Header'
const LoginForm = () => {
    const { loading ,setLoading }    = useLoading()
    const navigate=useNavigate()
    const dispatch=useDispatch()
    const onSubmit = async () =>{
      setLoading(true)
        try{
            const response= await axiosInstance.post('authentication/login/',values, {
                headers :{
                    "Content-type" :"application/json"
                }
            })
            
            if (response?.data.status == 200){
                toast.success(response?.data.message)
                 setLoading(false)
                dispatch(UserLogin({
                  refreshToken : response?.data.refresh,
                  accessToken : response?.data.access,
                  user: response?.data.username,
                  pk: response?.data.pk,
               })) 
             
                navigate('/')
               
              }else if (response?.data.status === 404) {
                    toast.error(response?.data.message)
                    setLoading(false)
                    
                  } else if (response?.data.status === 401) {
                    toast.error(response?.data.message)
                    setLoading(false)
                  } else if (response?.data.status === 400) {
                    toast.error(response?.data.message)
                    setLoading(false)
                  } else {
                    toast.error('something went wrong')
                    setLoading(false)
                  }
              }catch (error) {
                setLoading(false)
            console.log(error)
      
          }
    }

    const {
        values ,
         errors,
         touched,
         handleBlur,
         handleChange,
         handleSubmit} = useFormik({
            initialValues:{
                email:"",
                password:""
            },
            validationSchema: loginSchema ,
            onSubmit,
         })

         const reachGoogle = ()=>{
          const clientID=import.meta.env.VITE_GOOGLE_CLIENT_ID;
          const callBackURI=import.meta.env.VITE_DEVELOP === 'True' ? 'http://localhost:5173/' : 'https://merhaba-chat.netlify.app/';
          window.location.replace(`https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${callBackURI}&prompt=consent&response_type=code&client_id=${clientID}&scope=openid%20email%20profile&access_type=offline`)
         }

  
  return (
    <>
    <Header/>
    <section className="bg-secondary h-screen ">
    <div className="flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
        <div className="w-full shadow-inner shadow-shiny bg-primary rounded-lg  md:mt-0 sm:max-w-md xl:p-0 ">
            <div className=" p-6 space-y-4 md:space-y-6 sm:p-8 ">
                <h1 className="text-xl font-bold leading-tight ml-[40%] text-shiny tracking-tight md:text-2xl ">
                    LogIn
                </h1>
                <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}  encType="multipart/form-data">
                
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-shiny ">Your email</label>
                        <input type="email"
                         name="email"
                        id="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                         className="bg-gray-50 border border-gray-300  sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" 
                         placeholder="Enter your Email" />
                    {errors.email && touched.email && (
                <p className="text-red-600">{errors.email}</p>
              )}
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-shiny ">Password</label>
                        <input type="password"
                         name="password"
                          id="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                           placeholder="Enter your Password"
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" />
                    {errors.password && touched.password && (
                <p className="text-red-600">{errors.password}</p>
              )}
                   <p className='text-newTeal mt-2 underline cursor-pointer hover:text-shiny '>Forgot Password?</p>
                    </div>
                    {loading? <button disabled
                    type="submit" 
                    className="w-full text-white bg-secondary hover:bg-newTeal hover:text-black font-medium rounded-lg text-sm px-5 py-2.5 text-center "
                    >
                        <svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-3 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2"/>
    </svg>Please wait..
                    </button>:<button 
                    type="submit" 
                    className="w-full text-white bg-secondary hover:bg-newTeal hover:text-black font-medium rounded-lg text-sm px-5 py-2.5 text-center "
                    >Login
                    </button>}

                    <p className="text-sm font-light text-shiny ">
                        Don't have an account? <Link to={'/signup'} className="font-medium text-shiny hover:underline ">SignUp here</Link>
                    </p>
                    <p className="w-full text-white font-medium rounded-lg text-sm px-5 py-1 text-center " >OR</p>
                    <p className="w-full text-white bg-secondary font-medium rounded-lg text-sm px-5 py-2.5 text-center cursor-pointer" onClick={reachGoogle} >Google</p>
                </form>
            </div>
        </div>
    </div>
  </section>
    </>
  )
}

export default LoginForm
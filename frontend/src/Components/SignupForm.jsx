import React from 'react'
import { Link } from 'react-router-dom'
import { useFormik } from 'formik'
import { axiosInstance } from '../Axios/instanse'
import {toast} from 'react-toastify'
import { registrationSchema } from '../Validations/registrationValidation'
const SignupForm = () => {

    const onSubmit=async ()=>{
        const form = new FormData()
        form.append('email',values.email)
        form.append('username',values.username)
        form.append('password',values.password)

        try {
            const response= await axiosInstance
            .post('authentication/register/',form,
            {
                headers :{
                    "Content-type" :"multipart/formdata"
                }
            })
            console.log(response);
            if(response.status===200){
                toast.info('Successfully registered.An activation link has been sent to you.Please check your email!')

            }else{
                toast.error('Something went wrong')
            }
        } catch (error) {
            console.log(error);
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
                username:"",
                password:""
            },
            validationSchema:registrationSchema,
            onSubmit,
         })
  return (
    <section className="bg-secondary  h-screen ">
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full shadow-inner shadow-shiny bg-primary rounded-lg  md:mt-0 sm:max-w-md xl:p-0 ">
            <div className=" p-6 space-y-4 md:space-y-6 sm:p-8 ">
                <h1 className="text-xl font-bold leading-tight ml-[40%] text-shiny tracking-tight md:text-2xl ">
                    Signup
                </h1>
                <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}  encType="multipart/form-data">
                
                <div>
                        <label htmlFor="username" className="block mb-2 text-sm font-medium text-shiny ">Your username</label>
                        <input 
                        type="username" 
                        name="username" 
                        id="username" 
                        value={values.username}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" 
                        placeholder="Enter Your Username" 
                        />
                 {errors.username && touched.username && (
              <p className="text-red-600">{errors.username}</p>
            )}
               
                    </div>
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-shiny ">Your email</label>
                        <input 
                        type="email" 
                        name="email" 
                        id="email" 
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" 
                        placeholder="Enter Your Email" 
                       />
 {errors.email && touched.email && (
                <p className="text-red-600">{errors.email}</p>
              )}
                 
                    </div>
                   
                    <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-shiny ">Password</label>
                        <input 
                        type="password" 
                        name="password" 
                        id="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur} 
                        placeholder="Enter Your Password" 
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  " 
                        />
                         {errors.password && touched.password && (
                <p className="text-red-600">{errors.password}</p>
              )}
                 
                    </div>
  
                   
                    
                    <button 
                    type="submit" 
                    className="w-full text-white bg-secondary hover:bg-newTeal hover:text-black font-medium rounded-lg text-sm px-5 py-2.5 text-center "
                    >Create an account
                    </button>
                    <p className="text-sm font-light text-shiny ">
                        Already have an account? <Link to={'/login'} className="font-medium text-primary-600 hover:underline ">Login here</Link>
                        
                    </p>
                </form>
            </div>
        </div>
    </div>
  </section>
  )
}

export default SignupForm
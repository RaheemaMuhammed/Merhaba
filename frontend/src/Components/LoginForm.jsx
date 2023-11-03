import React from 'react'
import { Link } from 'react-router-dom'
const LoginForm = () => {

  return (
    <section className="bg-secondary h-screen ">
    <div className="flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
        <div className="w-full shadow-inner shadow-shiny bg-primary rounded-lg  md:mt-0 sm:max-w-md xl:p-0 ">
            <div className=" p-6 space-y-4 md:space-y-6 sm:p-8 ">
                <h1 className="text-xl font-bold leading-tight ml-[40%] text-shiny tracking-tight md:text-2xl ">
                    LogIn
                </h1>
                <form className="space-y-4 md:space-y-6"  encType="multipart/form-data">
                
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-shiny ">Your email</label>
                        <input type="email"
                         name="email"
                        id="email"
                    //     value={values.email}
                    // onChange={handleChange}
                    // onBlur={handleBlur}
                         className="bg-gray-50 border border-gray-300 text-shiny sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" 
                         placeholder="Enter your Email" />
                         
                    </div>
                   
                   
  
                    <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-shiny ">Password</label>
                        <input type="password"
                         name="password"
                          id="password"
                    //       value={values.password}
                    // onChange={handleChange}
                    // onBlur={handleBlur}
                           placeholder="Enter your Password"
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" />
                    
                   <p className='text-newTeal mt-2 underline cursor-pointer hover:text-shiny '>Forgot Password?</p>
                    </div>
  
                    
                    <button type="submit" className="w-full text-white bg-secondary hover:bg-newTeal hover:text-black font-medium rounded-lg text-sm px-5 py-2.5 text-center " >LogIn</button>
                    <p className="text-sm font-light text-shiny ">
                        Don't have an account? <Link to={'/signup'} className="font-medium text-shiny hover:underline ">SignUp here</Link>
                    </p>
                    <p className="w-full text-white font-medium rounded-lg text-sm px-5 py-1 text-center " >OR</p>
                    <p className="w-full text-white bg-secondary font-medium rounded-lg text-sm px-5 py-2.5 text-center " >Google</p>
                </form>
            </div>
        </div>
    </div>
  </section>
  )
}

export default LoginForm
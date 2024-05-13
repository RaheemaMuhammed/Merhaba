import React,{useState} from 'react'

import { useFormik } from "formik";
import { Link, NavLink } from 'react-router-dom';
const Profile = () => {
    
  

  

  
  


  
  // for image to text purpose
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileInput, setFileInput] = useState(false); //input icon visible or not

  
 

  
  
  
 
  // handling generating the response from llms
  const onSubmit = async () => {
    console.log(values);

   
  };

  // formik intialisation
      const {
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
      } = useFormik({
        initialValues: {
          prompt: "",
          models: [],
          purpose: null,
        },
        validationSchema: "generateSchema",
        onSubmit,
      });
 
  

 

  

  // file change for picture to text purpose
  const handleFileChange = (event) => {
  
    const file = event.target.files[0];
    setSelectedFile(file);
  };
  return (
    <div className='md:flex '>
     <aside className="hidden md:block top-0 md:h-screen w-[220px]  px-0  bg-primary-400 shadow-md shadow-neutral-400 sticky  ">
      {/* <div className={`md:hidden  ${isToggled ? 'w-fit z-50' : ' z-30 fixed mt-2'}  translate-x-0 duration-300 ease-linear`}>
                            <button
                                className="p-1 text-black outline-none  mb-0 mr-0"
                                onClick={handleToggle}
                            >
                                {isToggled ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-6 h-6 text-white"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-6 h-6"
                                        fill="white"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div> */}
      <div
        className={` flex flex-col h-full  `}
      >
        <div className=" h-fit">
          <div className="max-w-full cursor-pointer border-b h-[56px] border-b-secondary-300">
            <Link to={"/"}>
               <p className="text-xl text-center px-3 text-secondary-50 ">multinotes.ai</p>
              
              {/* <img src={logo} alt="logo" className="w-full h-[54px]" /> */}
            </Link>
        
          </div>
          <ul className="text-base mt-6 px-3 space-y-2">
            <NavLink
              to=""
              end
              className={({ isActive, isPending }) =>
                isPending
                  ? "bg-black"
                  : isActive
                  ? " text-white   "
                  : "text-secondary-200"
              }
            >
              <li className="cursor-pointer flex gap-2 px-3 py-2">
               
                Home
              </li>
            </NavLink>
              <NavLink
                to="prompt_library/"
                className={({ isActive, isPending }) =>
                  isPending
                    ? " "
                    : isActive
                    ? " text-white   "
                    : "text-secondary-200"
                }
              >
            <li className="flex cursor-pointer gap-2  px-3 py-2">
             

                Prompts
            </li>
              </NavLink>
              <NavLink
                to="notebook/"
                className={({ isActive, isPending }) =>
                  isPending
                    ? " "
                    : isActive
                    ? " text-white   "
                    : "text-secondary-200"
                }
              >
            <li className="flex cursor-pointer gap-2  px-3 py-2">
             
                NoteBook
            </li>
              </NavLink>
            
          </ul>
        </div>
        <div className="h-[820px]"></div>
          <div className="flex-1  h-[130px] ">
           
            <div className="px-2 mx-2 flex flex-col py-4 justify-center text-secondary-200 text-xs">
                <p>
                Version 1.0

                </p>
                
            </div>
          </div>
      </div>
    </aside>
    <div className='flex-1'>
    <div className="flex min-h-screen max-h-screen bg-secondary-50  text-gray-800">
      <div
        className={`flex flex-col items-center justify-center flex-1`}
      >
       
        {/* <!-- Component Start --> */}
        <div className="flex flex-col flex-grow w-full overflow-hidden ">
          <span className="h-[56px] border-b  border-secondary-200 border-opacity-30 flex justify-end ">
           
          </span>
          <div className="flex flex-col flex-grow h-0 py-4 ">
            {/* {!loading ? (
              <div className="">
                <div className="w-[89%] mx-auto">
                  <div className="grid grid-cols-1  md:grid-cols-2 gap-2">
                    {[1, 2]?.map((item, index) => (
                      <div className="bg-white rounded-md shadow hover:shadow-xl">
                        <div className="bg-white rounded p-2 cursor-pointer overflow-hidden relative  w-full mb-2 animate-pulse">
                          <div className="flex justify-between mx-8 mt-4">

                          <div className="h-2.5 bg-gray-200 rounded-full w-48 mb-4"></div>
                          <div className="h-2.5 bg-gray-200 rounded-full w-24 mb-4"></div>
                          </div>
                         
                          <div className="flex items-center justify-center h-48 mx-8 mb-4 bg-gray-300 rounded "></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : ( */}
          <></>
          </div>

          <div className="rounded-md  w-[90%] mb-[40px] mx-auto border border-boxBorder shadow-xl drop-shadow-xl ">
            <form >
            
              <div className="flex px-5 bg-white rounded-t-md">
                {/* {selectedFile && (
                  <>
                    <div className="rounded-lg  relative z-10 block">
                      <p
                        className="absolute top-2 z-20 cursor-pointer"
                        onClick={() => {
                          setSelectedFile(null);
                        }}
                      >
                        <IoMdCloseCircleOutline size={24} color="#012853" />
                      </p>
                      <img
                        className="w-[70px] h-[70px] mt-4 rounded-2xl m-2 ml-2"
                        src={
                          prompt_image
                            ? URL.createObjectURL(selectedFile)
                            : baseURLImages + selectedFile
                        }
                        alt={`preview`}
                      />
                    </div>
                  </>
                )} */}
                <textarea
                  className="resize-none  h-28 w-full border-none max-h-fit py-2 rounded-t-md text-secondary-500 focus:ring-0 "
                  type="text"
                  name="prompt"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  id="prompt"
                  
                  placeholder="Write your prompt…"
                />
                <div>
                  {fileInput && (
                    <>
                      {/* Hidden file input element */}
                      <input
                        type="file"
                        id="fileInput"
                        accept="image/png, image/jpeg"
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                      />
                      {/* Attachment icon triggering file input */}
                      <p
                        className="mt-8 py-3 px-2 cursor-pointer rounded-md"
                        onClick={() => {
                          document.getElementById("fileInput").click();
                        }}
                      >
                    
                      </p>
                    </>
                  )}
                </div>

                <button
                  type="submit"
                  className={`bg-white flex flex-col justify-center p-2 cursor-pointer `}
                >
                  
                </button>
              </div>

              <div className="flex py-2 md:py-4 gap-4 bg-boxBg rounded-b-md px-5 border-t border-t-boxBorder">
                
                <span
                  className={`cursor-pointer flex items-center gap-2 px-2 md:px-4 py-1 md:py-2 border bg-white border-primary-400 rounded-full`}
                
                >
                  {/* <LuHeart size={19} color="#6C727E" /> */}
                  <p className="text-sm">Save</p>
                </span>
              </div>
            </form>
          </div>
        </div>
        {/* <!-- Component End  --> */}
      </div>

      
    </div>
    </div>
  </div>
    
  )
}

export default Profile









import { createContext,useContext,useState } from "react";

export const LoadingContext=createContext({
     loading:false,
     setLoading:null,
     msgLoading:false,
     setMsgLoading:null,
    })
    

export const LoadingProvider=({children}) =>{
    const [loading,setLoading] =useState(false)
    const [msgLoading,setMsgLoading] =useState(false)
    const value={loading,setLoading,msgLoading,setMsgLoading}
    return(
        <LoadingContext.Provider value={value}>
            {children}
        </LoadingContext.Provider>
    );  
}


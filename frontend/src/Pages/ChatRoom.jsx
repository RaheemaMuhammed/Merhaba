import React,{useEffect, useState} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { axiosInstance } from '../Axios/instanse'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import useWebSocket from '../WebSocket/useWebSocket'
import { useLoading } from '../CustomHooks/useLoading'

const ChatRoom = () => {
  const { loading ,setLoading }    = useLoading()

    const navigate=useNavigate()
    const {roomCode} =useParams()
    const [roomData,setRoomData]=useState('')
    const token=useSelector(state=> state.UserReducer.accessToken)
    const [newuser,setNewUser]=useState(false)
    const pk=useSelector(state=> state.UserReducer.pk)
    const socketRef = useWebSocket(roomCode, token, setNewUser);

    useEffect(() => {
     console.log(roomCode);
     const getRoomDetails =async ()=>{
        try {
            const response= await axiosInstance.
            get('chat/chatroom/',
            {
              headers :{
                "Content-type" :"application/json",
                Authorization:`Bearer ${token}`,
            },params:{
                    code:roomCode
                },
            })
            if(response?.data?.status===200){
              setLoading(false)

              setRoomData(response?.data.payload)
            }else{
              toast.error('No room')
              navigate('/')

            }
        } catch (error) {
            console.log(error);
        }
        
    }
    getRoomDetails()
    }, [newuser])

   
    


    const handleStop=async()=>{
      const response=await axiosInstance.delete('chat/chatroom/',
      {
        headers :{
          "Content-type" :"application/json",
          Authorization:`Bearer ${token}`,
      },params:{
              code:roomCode
          },
      })

    }
    

    
  return (

    <>{
      loading ? <p>loading....</p> :
      <div className="w-screen">
        
    {/* <!-- Chatting -->  */}
    <div className="flex flex-row justify-between bg-white">
      {/* <!-- chat list --> */}
      <div className="flex flex-col w-2/5 border-r-2 overflow-y-auto">
        {/* <!-- search compt --> */}
        <div className="border-b-2 py-4 px-2 flex justify-between">
          <p className='text-xl font-semibold'>{roomData?.room_name?.toUpperCase()}</p>
          {pk===roomData?.host_details?.pk && 
          
          <p className='right-2 bg-red-500 text-white p-1 px-2 shadow-red-700 shadow-md' onClick={handleStop}>Stop</p>
          }
        </div>
        {/* <!-- end search compt -->
        <!-- user list --> */}
        <div
          className="flex flex-row py-3 px-2 justify-center items-center border-b-2 relative"
        >
          <div className="w-1/4">
            <img
              src={`http://127.0.0.1:8000${roomData?.host_details?.profile_pic}`}
              className="object-cover h-12 w-12 rounded-full"
              alt=""
            />
          </div>
          <div className="w-full">
            <div className="text-lg font-semibold">{roomData?.host_details?.username}</div>
          </div>
        <div className='absolute right-2 bg-green-500 text-white p-1 px-2 rounded-xl'><p>host</p></div>
        </div>
        {roomData?.participants_details?.map((item,indx)=>{
            return(
                <div key={indx}
          className="flex flex-row py-4 px-2 justify-center items-center border-b-2"
        >
          <div className="w-1/4">
            <img
              src={`http://127.0.0.1:8000${item ?.profile_pic}`}

              className="object-cover h-12 w-12 rounded-full"
              alt=""
            />
          </div>
          <div className="w-full">
            <div className="text-lg font-semibold">{item?.username}</div>
          </div>
        </div>

            )
        })

        }
        
    

       
        {/* <!-- end user list --> */}
      </div>
      {/* <!-- end chat list -->
      <!-- message --> */}
      <div className="w-full px-5 flex flex-col justify-between h-screen">
        <div className="flex flex-col mt-5">
          <div className="flex justify-end mb-4">
            <div
              className="mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white"
            >
              Welcome to group everyone !
            </div>
            <img
              src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
              className="object-cover h-8 w-8 rounded-full"
              alt=""
            />
          </div>
          <div className="flex justify-start mb-4">
            <img
              src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
              className="object-cover h-8 w-8 rounded-full"
              alt=""
            />
            <div
              className="ml-2 py-3 px-4 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white"
            >
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat
              at praesentium, aut ullam delectus odio error sit rem. Architecto
              nulla doloribus laborum illo rem enim dolor odio saepe,
              consequatur quas?
            </div>
          </div>
          <div className="flex justify-end mb-4">
            <div>
              <div
                className="mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white"
              >
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Magnam, repudiandae.
              </div>

              <div
                className="mt-4 mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white"
              >
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Debitis, reiciendis!
              </div>
            </div>
            <img
              src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
              className="object-cover h-8 w-8 rounded-full"
              alt=""
            />
          </div>
          <div className="flex justify-start mb-4">
            <img
              src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
              className="object-cover h-8 w-8 rounded-full"
              alt=""
            />
            <div
              className="ml-2 py-3 px-4 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white"
            >
              happy holiday guys!
            </div>
          </div>
        </div>
        <div className="py-5">
          <input
            className="w-full bg-gray-300 py-5 px-3 rounded-xl"
            type="text"
            placeholder="type your message here..."
          />
        </div>
      </div>
      {/* <!-- end message --> */}
     
      </div>
    </div>
    }
    
    </>
   

  )
}

export default ChatRoom
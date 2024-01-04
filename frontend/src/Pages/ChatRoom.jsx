import React,{useEffect, useState} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { axiosInstance } from '../Axios/instanse'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import useWebSocket from '../WebSocket/useWebSocket'
import { useLoading } from '../CustomHooks/useLoading'
import avatar from '../../src/assets/avatar.jpg'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
const ChatRoom = () => {
  const { loading ,setLoading }    = useLoading()
    const [showPicker,setShowPicker]=useState(false)
    const navigate=useNavigate()
    const {roomCode} =useParams()
    const [roomData,setRoomData]=useState('')
    const token=useSelector(state=> state.UserReducer.accessToken)
    const [newuser,setNewUser]=useState(false)
    const pk=useSelector(state=> state.UserReducer.pk)
    const [incominMsg,setIncomingMsg]=useState('')
    const [sender,setSender]=useState({})
    const [messageList,setMessageList]=useState([])
    const socketRef = useWebSocket(roomCode, token, setNewUser,setIncomingMsg,setSender,setMessageList);
    const [message,setMessage] =useState('')

    useEffect(() => {
      setLoading(true)
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
            console.log(response);
            if(response?.data?.status===200){
              setLoading(false)

              setRoomData(response?.data?.payload?.user_data)
              setMessageList(response?.data?.payload?.message_data)
            }else if(response?.data?.status===404){
              setLoading(false)
              toast.error(response?.data?.message)
              navigate('/')




            }else{
              toast.error('No active room with this code')
              setLoading(false)

               navigate('/')

            }
        } catch (error) {
            console.log(error);
        }
        
    }
    getRoomDetails()
    }, [newuser])
  
    useEffect(() => {
      console.log(messageList);
    }, [messageList])
    

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

    const sendMessage =async()=>{
      
      try {
        const response=await axiosInstance
                        .post('chat/message/',
                        {'code':roomCode,
                      'content':message,
                    'sender':pk},
                        {
                        headers :{
                          "Content-type" :"application/json",
                          Authorization:`Bearer ${token}`, },
                        })
                        setMessage(()=>'')
                        console.log(response);
        
      } catch (error) {
        console.log(error);
      }
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
          
          <p className='right-2 bg-red-500 text-white p-1 px-2 shadow-red-700 shadow-md cursor-pointer' onClick={handleStop}>Stop</p>
          }
        </div>
        {/* <!-- end search compt -->
        <!-- user list --> */}
        <div
          className="flex flex-row py-3 px-2 justify-center items-center border-b-2 relative"
        >
          <div className="w-1/4">
            {
            roomData?.host_details?.profile_pic?<img
            src={`http://127.0.0.1:8000${roomData?.host_details?.profile_pic}`}
            className="object-cover h-12 w-12 rounded-full"
            alt=""
          />:<img
          src={avatar}
          className="object-cover h-9 w-9 rounded-full"
          alt=""
        />
          }
            
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
          {
            item ?.profile_pic? <img
            src={`http://127.0.0.1:8000${item ?.profile_pic}`}

            className="object-cover h-12 w-12 rounded-full"
            alt=""
          />:<img
          src={avatar}
          className="object-cover h-9 w-9 rounded-full"
          alt=""
        />
          }
           
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
      <div className="w-full px-5 flex flex-col justify-between h-screen relative">
        <div className="flex flex-col mt-5">
          {messageList?.map((item,indx)=>{
            
            return item?.sender_details?.pk===pk?(
              <div className="flex justify-end mb-4">
              <div
                className="mr-2 py-3 px-4 bg-messages rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-msgtxt"
              ><p className='font-semibold text-lg text-sender' >{item?.sender_details?.username}</p>
               {item?.content}
              </div>
              
            </div>

            ):(<div className="flex justify-start mb-4">
            
            <div
              className="ml-2 py-3 px-4 bg-messages rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-msgtxt"
            ><p className='font-semibold text-lg text-sender' >{item?.sender_details?.username}</p>
              {item?.content}
            </div>
          </div>)
          })}
        
        </div>
        {showPicker &&

        <Picker data={data} onEmojiSelect={(e)=>setMessage((msg)=> msg+e.native)} />
        }
        <div>

        </div>
        <div className="py-2 sticky bottom-0 flex gap-2 border-2 border-primary z-30 bg-white rounded-xl">
          <p className='ml-1 mt-1 cursor-pointer' onClick={()=>setShowPicker(!showPicker)}>

        <svg viewBox="0 0 200 200" width="40"  height="40" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" fill="white" r="78" stroke="grey" stroke-width="4"/>
  <g class="eyes">
    <circle cx="61" cy="82" r="7"/>
    <circle cx="127" cy="82" r="7"/>
  </g>
  <path d="m136.81 116.53c.69 26.17-64.11 42-81.52-.73" style={{fill:'none', stroke: 'black', strokeWidth: 3}}/>
</svg>
          </p>
          <input
            className="w-full  py-3 px-3 outline-none"
            type="text"
            placeholder="type your message here..."
            value={message}
            onChange={(e)=>setMessage(e.target.value)}
            onKeyDown={(e)=>{
              if(e.key=='Enter'){
                sendMessage()
                console.log(e);
              }}}
          />
          <p className='font-semibold mr-3 py-3 cursor-pointer' onClick={sendMessage}>send</p>
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
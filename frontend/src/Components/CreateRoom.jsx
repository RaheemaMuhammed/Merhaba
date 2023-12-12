import {useState} from 'react'
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import io from 'socket.io-client'
import { axiosInstance } from '../Axios/instanse';
const CreateRoom = () => {
    const [roomName, setRoomName] = useState('');
    const [roomCode, setRoomCode] = useState('');
    const [show,setShow]=useState(false)
    const token=useSelector(state=> state.UserReducer.accessToken)
    const navigate=useNavigate()

    const createLink =async(e)=>{
        e.preventDefault()
        if(!roomName){
            toast.error('Enter a room name')
        }
        else if(!token){
            navigate('/login')
        }else{
           
            try {
                const response=await axiosInstance.
                post('chat/chatroom/',
                {room_name:roomName},
                {
                    headers :{
                        "Content-type" :"application/json",
                        Authorization:`Bearer ${token}`,
                    },
                })
                if(response?.data?.status===201){
                    setRoomCode(response?.data?.room_code)
                     setShow(true)
                    toast.success('Room created Successfully')

                }
                
            } catch (error) {
                toast.error(error)
                
            }
        }
       
        


    }
    const handleRoomNameChange = (e) => {
        setRoomName(e.target.value);
      };
  return (
    <div className='bg-white end-0 border w-fit rounded-sm shadow-md shadow-gray-300 p-1'> 
    {show ? 
    <div className='p-2'>
        <p className='text-lg font-semibold'>Your ChatRoom-{roomName} is Ready!!</p>
        <p>Share the room code with your friends and start chatting!!</p>
        <p className='bg-gray-200 p-2 w-fit rounded-md mt-2'>{roomCode}</p>
        <Link to={`/chat/${roomCode}`}>
        
        <p className='text-shiny bg-primary p-2 border rounded-md mt-3 font-semibold text-base w-fit'>Join</p>
        </Link>
    </div> : 
    <form onSubmit={createLink}>
      <p className='text-center text-lg font-medium'>Create new Room</p>
      <input 
      type='text'
       name='name'
        id='name'
        className='bg-gray-50 border border-gray-200 text-black sm:text-sm rounded-lg mt-3 p-2.5 w-full'
        placeholder='Enter your room name..'
        value={roomName}
        onChange={handleRoomNameChange}
        />
        <button type='submit' className='text-shiny bg-primary p-2 border rounded-md mt-5 font-semibold text-base'>Create Link</button>
    </form>
}
    </div>
  )
}

export default CreateRoom
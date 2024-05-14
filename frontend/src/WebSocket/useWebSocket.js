import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const useWebSocket = (roomCode, token, setNewUser,setIncomingMsg,setSender,setMessageList) => {
  const socketRef = useRef(null);
  const navigate=useNavigate()

  useEffect(() => {
    var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
    const backendURL = import.meta.env.VITE_DEVELOP === 'True'
  ? '127.0.0.1:8000'
  : 'backendapi.site';
    socketRef.current = new WebSocket(`${ws_scheme}://${backendURL}/ws/join/${roomCode}/?token=${token}`);

    socketRef.current.onopen = () => {
      console.log('WebSocket connection opened.');
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
      if (data.joined) {
        setNewUser(prev=>!prev)
      }else if(data.deleted){
        toast.warn('This chatroom has been deleted')
        navigate('/')
      }else if (data.message){
        setIncomingMsg(()=>data?.content)
        setSender(()=>data?.sender)
        setMessageList((prev)=>[...prev,data])
        


      }else if(data.file){
        setMessageList((prev)=>[...prev,data])


      } else {
        toast.error('You cannot join');
      }
    };

    socketRef.current.onerror = (error) => {
      console.log('WebSocket connection error:', error);
    };

    socketRef.current.onclose = () => {
      console.log('WebSocket connection closed.');
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [roomCode, token]);

  return socketRef;
};

export default useWebSocket;

import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const useWebSocket = (roomCode, token, setNewUser) => {
  const socketRef = useRef(null);
  const navigate=useNavigate()

  useEffect(() => {
    socketRef.current = new WebSocket(`ws://127.0.0.1:8000/ws/join/${roomCode}/?token=${token}`);

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

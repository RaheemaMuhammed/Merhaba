import {useState,useEffect} from 'react'
import MerhabaImage1 from '../assets/MerhabaImg1.png'
import MerhabaImage2 from '../assets/MerhabaImg2.png'
import MerhabaImage3 from '../assets/MerhabaImg3.png'
const Home = () => {
const images=[MerhabaImage1,MerhabaImage2,MerhabaImage3]
const headings=["Get the link that you can share","Share with your Friends","Your chat is Safe"]
const lines=["Click Create Link to get a link that you can send to people that you want to meet with","You can share files with your friends and can even save it","No one can join and see your chat unless invited or admitted by the host"]
const [currentImg,setCurrentImg]=useState(0)
const prevImage = () => {
    if (currentImg > 0) {
      setCurrentImg(currentImg - 1);
    }else{
        setCurrentImg(2)
    }
  };

  const nextImage = () => {
    if (currentImg < images.length - 1) {
      setCurrentImg(currentImg + 1);
    }else{
        setCurrentImg(0)
    }
  };
  useEffect(() => {
    let interval;
    interval = setInterval(() => {
      if (currentImg < images.length - 1) {
        setCurrentImg(currentImg + 1);
      }else{
        setCurrentImg(0)
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [currentImg, images]);

  

  return (
    <div className='bg-primary w-screen h-screen relative' >
        <div className='flex w-screen gap-0 mx-0'>
<div className='flex flex-col gap-2 mt-10 justify-center right-0 mx-auto'>
<p className='text-6xl text-secondary'>Merhaba!</p>
<p className='text-xl text-white mt-5'>
        Chat with anyone, anywhere. Create chat rooms, share links<br/> and start chatting instantly. 
      </p>
      <button className='bg-secondary w-1/2 text-white py-2 px-4 mt-6 rounded-lg hover:text-primary hover:bg-secondary'>
        Create Link
      </button>
      
    </div>
      <div className='mx-auto '>
      <div className='relative mt-10'>
            <img
              className='h-[450px] shadow-lg rounded-full shadow-teal-300 transform translate-x-0 opacity-100 transition-transform duration-1000 ease-in-out'
              src={images[currentImg]}
              alt={`Image ${currentImg + 1}`}
                    />
      
            <div className='w-[500px] h-[100px] text-center'>

            <p className=' text-3xl text-shiny'>{headings[currentImg]}</p>
            <p className=' text-lg text-shiny'>{lines[currentImg]}</p>
            </div>
          </div>
      </div>
        </div>
  
        </div>
  )
}

export default Home
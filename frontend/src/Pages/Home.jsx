import { useState, useEffect } from "react";
import MerhabaImage1 from "../assets/MerhabaImg1.png";
import MerhabaImage2 from "../assets/MerhabaImg2.png";
import MerhabaImage3 from "../assets/MerhabaImg3.png";
import CreateRoom from "../Components/CreateRoom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Header from "../Components/Header";
const Home = () => {
  const images = [MerhabaImage1, MerhabaImage2, MerhabaImage3];
  const headings = [
    "Get the link that you can share",
    "Share with your Friends",
    "Your chat is Safe",
  ];
  const lines = [
    "Click Create Link to get a link that you can send to people that you want to meet with",
    "You can share files with your friends and can even save it",
    "No one can join and see your chat unless invited or admitted by the host",
  ];
  const [currentImg, setCurrentImg] = useState(0);
  const [newChatBox, setNewChatBox] = useState(false);
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const token = useSelector((state) => state.UserReducer.accessToken);

  useEffect(() => {
    let interval;
    interval = setInterval(() => {
      if (currentImg < images.length - 1) {
        setCurrentImg(currentImg + 1);
      } else {
        setCurrentImg(0);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [currentImg, images]);

  const handleRoomJoin = (e) => {
    e.preventDefault();
    if (!code) {
      toast.error("enter roomcode");
    } else {
      navigate(`/chat/${code}`);
    }
  };

  return (
    <>
      <Header />
      <div className="bg-primary w-screen h-screen relative">
        <div className="sm:flex w-screen gap-0 mx-0">
          <div className="flex flex-col gap-2 mt-10 right-0 mx-auto ">
            <div className="mx-2 mt-[15%] sm:mt-[30%] ">
              <p className="text-6xl text-secondary">Merhaba!</p>
              <p className="text-xl text-white mt-5">
                Chat with anyone, anywhere. Create chat rooms, share links
                <br /> and start chatting instantly.
              </p>

              <form className="flex gap-1 w-[80%]">
                <p
                  onClick={() => setNewChatBox(!newChatBox)}
                  className="bg-secondary w-1/4 text-white px-1 py-2 mt-5 text-sm font-semibold rounded-lg hover:text-primary hover:bg-secondary text-center cursor-pointer"
                >
                  New Chat
                </p>

                <input
                  type="text"
                  name="code"
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="bg-gray-50 border border-shiny text-black sm:text-sm rounded-lg mt-5 p-2.5 w-full"
                  placeholder="Enter code or Link"
                />

                <button
                  className="text-gray-500 mt-5 mx-2 font-bold text-lg"
                  onClick={handleRoomJoin}
                >
                  join
                </button>
              </form>
            </div>
            {newChatBox && <CreateRoom />}
          </div>

          <div className="mx-auto hidden sm:block ">
            <div className="relative mt-10">
              <img
                className="sm:h-[300px] md:h-[450px] shadow-lg rounded-full shadow-teal-300 transform translate-x-0 opacity-100 transition-transform duration-1000 ease-in-out"
                src={images[currentImg]}
                alt={`Image ${currentImg + 1}`}
              />

              <div className="sm:w-[300px] sm:h-[60px] md:w-[500px] md:h-[100px] text-center">
                <p className=" text-3xl text-shiny">{headings[currentImg]}</p>
                <p className=" text-lg text-shiny">{lines[currentImg]}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

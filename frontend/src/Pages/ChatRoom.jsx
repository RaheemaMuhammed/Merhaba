import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../Axios/instanse";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import useWebSocket from "../WebSocket/useWebSocket";
import { useLoading } from "../CustomHooks/useLoading";
import avatar from "../../src/assets/avatar.jpg";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { SlEmotsmile } from "react-icons/sl";
import { MdAttachFile } from "react-icons/md";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { BsSend } from "react-icons/bs";

const ChatRoom = () => {
  const { loading, setLoading, msgLoading, setMsgLoading } = useLoading();
  const [showPicker, setShowPicker] = useState(false);
  const navigate = useNavigate();
  const { roomCode } = useParams();
  const [roomData, setRoomData] = useState("");
  const token = useSelector((state) => state.UserReducer.accessToken);
  const [newuser, setNewUser] = useState(false);
  const pk = useSelector((state) => state.UserReducer.pk);
  const [incominMsg, setIncomingMsg] = useState("");
  const [sender, setSender] = useState({});
  const [messageList, setMessageList] = useState([]);
  const socketRef = useWebSocket(
    roomCode,
    token,
    setNewUser,
    setIncomingMsg,
    setSender,
    setMessageList
  );
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const messagesEndRef = useRef(null);

  // const aws_url=import.meta.env.VITE_AWS_BASE_URL

  useEffect(() => {
    setLoading(true);
    const getRoomDetails = async () => {
      try {
        const response = await axiosInstance.get("chat/chatroom/", {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          params: {
            code: roomCode,
          },
        });
        console.log(response);
        if (response?.data?.status === 200) {
          setLoading(false);

          setRoomData(response?.data?.payload?.user_data);
          setMessageList(response?.data?.payload?.message_data);
        } else if (response?.data?.status === 404) {
          setLoading(false);
          toast.error(response?.data?.message);
          navigate("/");
        } else {
          toast.error("No active room with this code");
          setLoading(false);
          navigate("/");
        }
      } catch (error) {
        console.log(error);
      }
    };
    getRoomDetails();
  }, [newuser]);

  const handleStop = async () => {
    const response = await axiosInstance.delete("chat/chatroom/", {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      params: {
        code: roomCode,
      },
    });
  };

  const sendMessage = async () => {
    if (msgLoading) {
      toast.warning("please wait");
    } else {
      setShowPicker(false);
      setMsgLoading(true);
      try {
        const formData = new FormData();
        formData.append("code", roomCode);
        formData.append("content", message);
        formData.append("sender", pk);
        if (selectedFile) {
          formData.append("file", selectedFile);
        }

        const response = await axiosInstance.post("chat/message/", formData, {
          headers: {
            "Content-type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response?.data?.status === 201) {
          setMsgLoading(false);

          setMessage(() => "");
          setFile(null);
          setSelectedFile(null);
        }
        console.log(response);
      } catch (error) {
        setMsgLoading(false);
        console.log(error);
      }
    }
  };

  const addEmoji = (e) => {
    let sym = e.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    setMessage((msg) => msg + emoji);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setFile(file);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // This useEffect will trigger scrolling whenever messageList changes
  // useEffect(() => {
  //   scrollToBottom();
  // }, [messageList]);

  return (
    <>
      {loading ? (
        <p>loading....</p>
      ) : (
        <>
          {/* <!-- Chatting -->  */}
          <div className=" grid grid-cols-7 ">
            {/* <!-- chat list --> */}
            <div className="self-start sticky top-0 col-span-2 ">
              <div className="border-b-2 py-4 px-2 flex justify-between ">
                <p className="text-xl font-semibold">
                  {roomData?.room_name?.toUpperCase()}
                </p>
                {pk === roomData?.host_details?.pk && (
                  <p
                    className="right-2 bg-red-500 text-white p-1 px-2 shadow-red-700 shadow-md cursor-pointer"
                    onClick={handleStop}
                  >
                    Stop
                  </p>
                )}
              </div>
              {/* List of participants */}
              <div className="flex flex-row py-3 px-2 justify-center items-center border-b-2">
                <div className="w-1/4 ">
                  {roomData?.host_details?.profile_pic ? (
                    <img
                      src={roomData?.host_details?.profile_pic}
                      className="object-cover h-12 w-12 rounded-full"
                      alt=""
                    />
                  ) : (
                    <img
                      src={avatar}
                      className="object-cover h-9 w-9 rounded-full"
                      alt=""
                    />
                  )}
                </div>
                <div className="w-full">
                  <div className="text-lg font-semibold">
                    {roomData?.host_details?.username}
                  </div>
                </div>
                <div className="absolute right-2 bg-green-500 text-white p-1 px-2 rounded-xl">
                  <p>host</p>
                </div>
              </div>
              {roomData?.participants_details?.map((item, indx) => {
                return (
                  <div
                    key={indx}
                    className="flex flex-row py-4 px-2 justify-center items-center border-b-2"
                  >
                    <div className="w-1/4 mr-1">
                      {item?.profile_pic ? (
                        <img
                          src={item?.profile_pic}
                          className="object-cover h-12 w-12 rounded-full"
                          alt=""
                        />
                      ) : (
                        <img
                          src={avatar}
                          className="object-cover h-9 w-9 rounded-full"
                          alt=""
                        />
                      )}
                    </div>
                    <div className="w-full">
                      <div className="text-lg font-semibold">
                        {item?.username}
                        <p className="text-base text-primary inline-flex mx-1">
                          {item?.pk === pk ? " (you)" : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/*End List of participants */}
            </div>
            {/* messages listing part */}
            <div className="col-span-5 h-screen border-l overflow-hidden ">
                  <div className="px-5 h-[85%] overflow-auto scrollbar mt-5 relative">
                    {messageList?.map((item, indx) => {
                      return item?.sender_details?.pk === pk ? (
                        <div key={indx} className="flex justify-end mb-4">
                          <div className="mr-2 py-3 px-4 bg-messages rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-msgtxt">
                            <p className="font-semibold text-lg text-sender">
                              {item?.sender_details?.username}
                            </p>
                            {item?.photo && (
                              <img
                                className="h-[300px] w-[300px]"
                                src={item?.photo}
                              />
                            )}
                            {item?.video && (
                              <video width="320" height="240" controls>
                                <source src={item.video} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                            )}
                            {item?.document && (
                              <a
                                href={item?.document}
                                target="_blank"
                                rel="noreferrer"
                                className="text-primary underline"
                              >
                                {item?.document.split("/").pop()}
                              </a>
                            )}
                            {item?.content}
                          </div>
                        </div>
                      ) : (
                        <div key={indx} className="flex justify-start mb-4">
                          <div className="ml-2 py-3 px-4 bg-messages rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-msgtxt">
                            <p className="font-semibold text-lg text-sender">
                              {item?.sender_details?.username}
                            </p>
                            {item?.photo && (
                              <img
                                className="h-[300px] w-[300px]"
                                src={item.photo}
                              />
                            )}
                            {item?.video && (
                              <video width="320" height="240" controls>
                                <source src={item.video} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                            )}
                            {item?.document && (
                              <a
                                href={item?.document}
                                target="_blank"
                                rel="noreferrer"
                                className="text-primary underline"
                              >
                                {item?.document.split("/").pop()}
                              </a>
                            )}
                            {item?.content}
                          </div>
                        </div>
                      );
                    })}
                    {/* for automatic scrolling to bottom */}
                    {/* <div ref={messagesEndRef} /> */}
                    {/* for emoji selection */}
                    <div className="absolute mb-0 z-30 ">
                      {showPicker && (
                        <Picker data={data} onEmojiSelect={addEmoji} />
                      )}
                    </div>
                    

                    {selectedFile && (
                      <>
                        <div className="rounded-lg absolute mb-3 left-0  z-10">
                          <p
                            className="absolute top-0 z-20 cursor-pointer"
                            onClick={() => {
                              setSelectedFile(null);
                              setFile(null);
                            }}
                          >
                            <IoMdCloseCircleOutline size={24} />
                          </p>
                          {selectedFile?.type?.startsWith("image/") ? (
                            <img
                              src={URL.createObjectURL(selectedFile)}
                              alt={`preview`}
                              style={{
                                width: "70px",
                                height: "70px",
                                borderRadius: "15px",
                                margin: "3px",
                                marginLeft: "7px",
                              }}
                            />
                          ) : selectedFile?.type?.startsWith("video/") ? (
                            <video
                              style={{
                                width: "70px",
                                height: "70px",
                                borderRadius: "15px",
                                // margin: "3px",
                                marginLeft: "7px",
                              }}
                            >
                              <source
                                src={URL.createObjectURL(selectedFile)}
                                type={selectedFile.type}
                              />
                              Your browser does not support the video tag.
                            </video>
                          ) : (
                            <p className="w-fit border rounded-md p-1 m-1 ml-2 ">
                              {selectedFile?.name}
                            </p>
                          )}
                        </div>
                      </>
                    )}
                    
                  </div>

                  {/* message input */}
                  <div className="mx-1 py-2 border-t-2 border-b-2 border-primary z-50 bg-white rounded-xl relative ">
                    
                    <div className="flex gap-2">
                      <p
                        className="ml-1 mt-2 text-gray-700 cursor-pointer hover:bg-slate-300 p-1 rounded-md"
                        onClick={() => setShowPicker(!showPicker)}
                      >
                        <SlEmotsmile size={28} />
                      </p>
                      <div>
                        {/* Hidden file input element */}
                        <input
                          type="file"
                          id="fileInput"
                          multiple
                          onChange={handleFileChange}
                          style={{ display: "none" }}
                        />
                        {/* Attachment icon triggering file input */}
                        <p
                          className="mt-2 text-gray-700 cursor-pointer hover:bg-slate-300 p-1 rounded-md"
                          onClick={() => {
                            document.getElementById("fileInput").click();
                          }}
                        >
                          <MdAttachFile size={28} />
                        </p>
                      </div>

                      <input
                        className="w-full  py-3 px-3 outline-none"
                        type="text"
                        placeholder="type your message here..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key == "Enter") {
                            sendMessage();
                            setShowPicker(false);
                          }
                        }}
                      />
                      {(message || file) && (
                        <p
                          className={` className="text-shiny cursor-pointer hover:shadow-lg hover:shadow-shiny  p-1  mr-2 mt-2"
                          ${
                            msgLoading ? "cursor-wait" : "cursor-pointer"
                          }`}
                          onClick={sendMessage}
                        >
            
                        
                      
                          <BsSend size={30} color="#0C1446"/>
                        </p>
                      )}
                    </div>
                  </div>
            </div>
          </div>
          {/* <!-- end message --> */}
        </>
      )}
    </>
  );
};

export default ChatRoom;

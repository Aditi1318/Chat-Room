import React from "react";
import chatIcon from "../assets/group-chat.png";
import {useState} from "react";
import toast from "react-hot-toast";
import {createRoomApi} from "../services/RoomService";
import {joinChatApi} from "../services/RoomService";
import useChatContext from "../context/ChatContext";
import {useNavigate} from "react-router";

const JoinCreateChat = () => {
    const [detail, setDetail] = useState({
        roomId: "",
        userName: "",
    });

    const {setRoomId, setCurrentUser, setConnected} = useChatContext();
    const navigate = useNavigate();

    function handleFormInputChange(event) {
        //console.log("Event Target:", event.target.name, event.target.value);
        const {name, value} = event.target;

        if (name === "roomId" || name === "userName") {
            setDetail((prevDetail) => ({
                ...prevDetail,
                [name]: value,
            }));
        }
    }

    function validateForm() {
        if (detail.userName === "" || detail.roomId === "") {
            toast.error("Please fill in all fields", {});
            return false;
        }
        return true;
    }

    async function joinChat() {
        if (validateForm()) {
            //call api to join room on backend
            try {
                //call api to join room on backend
                const response = await joinChatApi(detail.roomId);
                toast.success("Room joined successfully");
                setRoomId(response.roomId);
                setCurrentUser(detail.userName);
                setConnected(true);
                navigate("/chat");
            } catch (error) {
                console.log(error);
                if (error.status == 404) {
                    toast.error("Room not found");
                } else {
                    toast.error("Failed to join room");
                }
            }
        }
    }

    async function createRoom() {
        if (validateForm()) {
            console.log(detail);
            //call api to create room on backend
            try {
                const response = await createRoomApi(detail.roomId);
                console.log(response);
                toast.success("Room created successfully");
                // join the room
                setRoomId(response.roomId);
                setCurrentUser(detail.userName);
                setConnected(true);

                navigate("/chat");

                joinChat();
            } catch (error) {
                console.log(error);
                if (error.status == 400) {
                    toast.error("Room already exists");
                } else {
                    toast.error("Failed to create room");
                }
            }
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="p-10 dark:border-gray-600 border w-full flex flex-col gap-5 max-w-md rounded dark:bg-gray-900 shadow">
                <div>
                    <img src={chatIcon} className="w-25 mx-auto" />
                </div>
                <h1 className="text-2xl font-semibold text-center">Join Room/Create Room</h1>
                {/* name div */}
                <div className="">
                    <label htmlFor="" className="block front-medium mb-2">
                        Your Name
                    </label>
                    <input
                        onChange={handleFormInputChange}
                        value={detail.userName}
                        type="text"
                        id="name"
                        name="userName"
                        placeholder="Enter your name"
                        className="w-full dark:bg-gray-600 px-4 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                </div>

                {/* room div */}
                <div className="">
                    <label htmlFor="" className="block front-medium mb-2">
                        Room ID / New Room ID
                    </label>
                    <input
                        name="roomId"
                        onChange={handleFormInputChange}
                        value={detail.roomId}
                        type="text"
                        id="roomId"
                        placeholder="Enter Room ID"
                        className="w-full dark:bg-gray-600 px-4 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                </div>

                {/* buttons */}
                <div className="flex justify-center gap-3 mt-4">
                    <button
                        onClick={joinChat}
                        className="px-3 py-2 bg-cyan-400 text-gray-900 hover:bg-cyan-600 
                                dark:bg-cyan-500 dark:text-white dark:hover:bg-cyan-800 rounded-lg transition-all"
                    >
                        Join Room
                    </button>

                    <button
                        onClick={createRoom}
                        className="px-3 py-2 bg-pink-300 text-gray-900 hover:bg-pink-500 
                                dark:bg-pink-400 dark:text-white dark:hover:bg-pink-800 rounded-lg transition-all"
                    >
                        Create Room
                    </button>
                </div>
            </div>
        </div>
    );
};
export default JoinCreateChat;

import React from "react";
// Using a built-in icon instead of a static asset for a cleaner look
import {BsChatDotsFill} from "react-icons/bs";
import {FaUser, FaHashtag} from "react-icons/fa";
import {useState} from "react";
import toast from "react-hot-toast";
import {createRoomApi, joinChatApi} from "../services/RoomService";
import useChatContext from "../context/ChatContext";
import {useNavigate} from "react-router";

const JoinCreateChat = () => {
    // --- All your existing state and logic remains the same ---
    const [detail, setDetail] = useState({
        roomId: "",
        userName: "",
    });
    const {setRoomId, setCurrentUser, setConnected} = useChatContext();
    const navigate = useNavigate();

    function handleFormInputChange(event) {
        const {name, value} = event.target;
        if (name === "roomId" || name === "userName") {
            setDetail((prevDetail) => ({...prevDetail, [name]: value}));
        }
    }

    function validateForm() {
        if (detail.userName.trim() === "" || detail.roomId.trim() === "") {
            toast.error("Please fill in all fields");
            return false;
        }
        return true;
    }

    async function joinChat() {
        if (validateForm()) {
            try {
                const response = await joinChatApi(detail.roomId);
                toast.success("Room joined successfully");
                setRoomId(response.roomId);
                setCurrentUser(detail.userName);
                setConnected(true);
                navigate("/chat");
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    toast.error("Room not found");
                } else {
                    toast.error("Failed to join room");
                }
            }
        }
    }

    async function createRoom() {
        if (validateForm()) {
            try {
                const response = await createRoomApi(detail.roomId);
                toast.success("Room created successfully");
                setRoomId(response.roomId);
                setCurrentUser(detail.userName);
                setConnected(true);
                navigate("/chat");
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    toast.error("Room already exists");
                } else {
                    toast.error("Failed to create room");
                }
            }
        }
    }

    // --- The JSX has been completely refactored for UI/UX and responsiveness ---
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-indigo-100 dark:from-gray-900 dark:to-slate-800 p-4">
            <div className="w-full max-w-md bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg border border-white/30 dark:border-gray-700/50 rounded-2xl shadow-xl p-8 space-y-6">
                {/* Header Section */}
                <div className="text-center">
                    <div className="inline-block p-4 bg-indigo-500 rounded-full mb-4">
                        <BsChatDotsFill className="text-4xl text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Welcome Back</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Enter a room or create a new one to start chatting.
                    </p>
                </div>

                {/* Form Inputs */}
                <div className="space-y-4">
                    {/* Your Name Input */}
                    <div className="relative">
                        <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            onChange={handleFormInputChange}
                            value={detail.userName}
                            type="text"
                            name="userName"
                            placeholder="Enter your name"
                            className="w-full pl-12 pr-4 py-3 bg-white/70 dark:bg-gray-700/50 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                    </div>

                    {/* Room ID Input */}
                    <div className="relative">
                        <FaHashtag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            name="roomId"
                            onChange={handleFormInputChange}
                            value={detail.roomId}
                            type="text"
                            placeholder="Enter Room ID"
                            className="w-full pl-12 pr-4 py-3 bg-white/70 dark:bg-gray-700/50 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    {/* Secondary Action: Create Room */}
                    <button
                        onClick={createRoom}
                        className="w-full sm:w-auto px-6 py-3 font-semibold text-indigo-600 dark:text-indigo-400 bg-transparent border-2 border-indigo-500 rounded-lg hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-500 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105"
                    >
                        Create Room
                    </button>
                    {/* Primary Action: Join Room */}
                    <button
                        onClick={joinChat}
                        className="w-full sm:w-auto px-6 py-3 font-semibold text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                        Join Room
                    </button>
                </div>
            </div>
        </div>
    );
};
export default JoinCreateChat;

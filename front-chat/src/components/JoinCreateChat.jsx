import React, {useState} from "react";
import {BsChatDotsFill} from "react-icons/bs";
import {FaUser, FaHashtag} from "react-icons/fa";
import toast from "react-hot-toast";
import {createRoomApi, joinChatApi} from "../services/RoomService";
import useChatContext from "../context/ChatContext";
import {useNavigate} from "react-router";
import {motion} from "framer-motion";

const JoinCreateChat = () => {
    const [detail, setDetail] = useState({roomId: "", userName: ""});
    const {setRoomId, setCurrentUser, setConnected} = useChatContext();
    const navigate = useNavigate();

    const handleFormInputChange = (event) => {
        const {name, value} = event.target;
        setDetail((prev) => ({...prev, [name]: value}));
    };

    const validateForm = () => {
        if (detail.userName.trim() === "" || detail.roomId.trim() === "") {
            toast.error("Please fill in all fields");
            return false;
        }
        return true;
    };

    const joinChat = async () => {
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
    };

    const createRoom = async () => {
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
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-100 via-indigo-100 to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Animated glow orbs */}
            <div className="absolute inset-0">
                <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-400/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
            </div>

            {/* Main Card */}
            <motion.div
                initial={{opacity: 0, y: 40}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.7, ease: "easeOut"}}
                className="relative z-10 w-full max-w-md bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl border border-white/20 dark:border-gray-700/30 rounded-3xl shadow-2xl p-8 space-y-6"
            >
                {/* Header */}
                <div className="text-center">
                    <div className="inline-block p-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-lg mb-4">
                        <BsChatDotsFill className="text-4xl text-white" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white">ChatSphere</h1>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                        Create or join a chat room and start talking instantly.
                    </p>
                </div>

                {/* About the App */}
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.5}}
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 p-4 rounded-xl text-center text-sm text-gray-700 dark:text-gray-300 shadow-inner"
                >
                    <p>
                        💬 <strong>ChatSphere</strong> is your personal chat room app —
                        <em> connect, collaborate, and share</em> in real time. Built for speed, simplicity, and
                        community.
                    </p>
                </motion.div>

                {/* Input Fields */}
                <div className="space-y-4">
                    {/* Username */}
                    <div className="relative">
                        <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            onChange={handleFormInputChange}
                            value={detail.userName}
                            type="text"
                            name="userName"
                            placeholder="Enter your name"
                            className="w-full pl-12 pr-4 py-3 bg-white/80 dark:bg-gray-700/50 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>

                    {/* Room ID */}
                    <div className="relative">
                        <FaHashtag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            onChange={handleFormInputChange}
                            value={detail.roomId}
                            type="text"
                            name="roomId"
                            placeholder="Enter Room ID"
                            className="w-full pl-12 pr-4 py-3 bg-white/80 dark:bg-gray-700/50 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <motion.button
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
                        onClick={createRoom}
                        className="w-full sm:w-auto px-6 py-3 font-semibold text-indigo-600 border-2 border-indigo-500 rounded-lg hover:bg-indigo-500 hover:text-white transition-all duration-300"
                    >
                        Create Room
                    </motion.button>

                    <motion.button
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
                        onClick={joinChat}
                        className="w-full sm:w-auto px-6 py-3 font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        Join Room
                    </motion.button>
                </div>

                {/* Footer */}
                {/* <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6">
                    Powered by React ⚛️ | Spring Boot 💻 | Socket.IO ⚡
                </p> */}
            </motion.div>
        </div>
    );
};

export default JoinCreateChat;

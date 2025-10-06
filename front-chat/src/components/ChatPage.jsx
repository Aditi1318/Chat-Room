import React from "react";
import {MdSend, MdAttachFile, MdOutlineEmojiEmotions, MdLightMode, MdDarkMode, MdLogout} from "react-icons/md";
import {useRef, useState, useEffect} from "react";
import EmojiPicker from "emoji-picker-react";
import useChatContext from "../context/ChatContext";
import {useNavigate} from "react-router";
import {baseURL} from "../config/AxiosHelper";
import SockJS from "sockjs-client";
import {Stomp} from "@stomp/stompjs";
import toast from "react-hot-toast";
import {getMessages} from "../services/RoomService";
import {timeAgo} from "../config/helper";
import axios from "axios";
import ReactMarkdown from "react-markdown";
// --- CHANGE 1: Import animation library ---
import {motion, AnimatePresence} from "framer-motion";

const ChatPage = () => {
    // --- All your existing state and logic remains the same ---
    const {roomId, currentUser, connected, setConnected, setRoomId, setCurrentUser} = useChatContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (!connected) {
            navigate("/");
        }
    }, [roomId, currentUser, connected]);

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [stompClient, setStompClient] = useState(null);
    const chatBoxRef = useRef(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [darkMode, setDarkMode] = useState(() => {
        const storedTheme = localStorage.getItem("theme");
        return storedTheme ? storedTheme === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    });
    const fileInputRef = useRef(null);

    const handleFileSelect = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("sender", currentUser);
            formData.append("roomId", roomId);
            try {
                const response = await axios.post(`${baseURL}/api/files/upload`, formData, {
                    headers: {"Content-Type": "multipart/form-data"},
                });
                const {fileId} = response.data;
                const message = {
                    sender: currentUser,
                    content: `📎 [${file.name}](${baseURL}/api/files/${fileId})`,
                    roomId: roomId,
                };
                stompClient.send(`/app/sendMessage/${roomId}`, {}, JSON.stringify(message));
            } catch (error) {
                console.error("File upload failed:", error);
                toast.error("File upload failed");
            }
        }
    };

    useEffect(() => {
        async function loadMessages() {
            try {
                const messages = await getMessages(roomId);
                setMessages(messages);
            } catch (error) {
                console.error("Failed to load messages:", error);
            }
        }
        if (connected) {
            loadMessages();
        }
    }, [connected, roomId]);

    useEffect(() => {
        if (!connected) return;
        const sock = new SockJS(`${baseURL}/chat`);
        const client = Stomp.over(sock);
        client.connect(
            {},
            () => {
                setStompClient(client);
                toast.success(`Connected to room: ${roomId}`);
                client.subscribe(`/topic/room/${roomId}`, (message) => {
                    const newMessage = JSON.parse(message.body);
                    setMessages((prev) => [...prev, newMessage]);
                });
            },
            (error) => {
                console.error("Connection error:", error);
                toast.error("Could not connect to chat server.");
            }
        );

        return () => {
            if (client && client.connected) {
                client.disconnect();
            }
        };
    }, [connected, roomId]);

    const sendMessage = async () => {
        if (stompClient && connected && input.trim()) {
            const message = {
                sender: currentUser,
                content: input,
                roomId: roomId,
            };
            stompClient.send(`/app/sendMessage/${roomId}`, {}, JSON.stringify(message));
            setInput("");
        }
    };

    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", darkMode);
        localStorage.setItem("theme", darkMode ? "dark" : "light");
    }, [darkMode]);

    function handleLogOut() {
        if (stompClient) {
            stompClient.disconnect();
        }
        setConnected(false);
        setRoomId("");
        setCurrentUser("");
        navigate("/");
    }

    // --- The JSX has been updated with the requested UI enhancements ---
    return (
        // --- CHANGE 2: Added subtle background gradient ---
        <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-indigo-100 dark:from-gray-900 dark:to-slate-800 transition-colors duration-300">
            {/* --- CHANGE 3: Added Frosted Glass effect to Header --- */}
            <header className="flex-shrink-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-md z-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex flex-col">
                            <h1 className="text-lg font-bold text-gray-800 dark:text-white">
                                Room: <span className="font-normal text-indigo-500 dark:text-indigo-400">{roomId}</span>
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
                                User: <span className="font-medium">{currentUser}</span>
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                                aria-label="Toggle Dark Mode"
                            >
                                {darkMode ? (
                                    <MdLightMode className="text-yellow-400 text-xl" />
                                ) : (
                                    <MdDarkMode className="text-gray-600 text-xl" />
                                )}
                            </button>
                            <button
                                onClick={handleLogOut}
                                className="flex items-center space-x-2 px-3 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                            >
                                <MdLogout className="text-xl" />
                                <span className="hidden sm:inline">Leave</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Chat Messages Area */}
            <main ref={chatBoxRef} className="flex-grow overflow-y-auto">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="space-y-4">
                        {/* --- CHANGE 4: Added AnimatePresence for message animations --- */}
                        <AnimatePresence>
                            {messages.map((message, index) => (
                                // --- CHANGE 5: Converted message div to motion.div and added animation props ---
                                <motion.div
                                    layout
                                    key={index}
                                    initial={{opacity: 0, scale: 0.8, y: 20}}
                                    animate={{opacity: 1, scale: 1, y: 0}}
                                    exit={{opacity: 0, scale: 0.8}}
                                    transition={{duration: 0.3, ease: "easeOut"}}
                                    className={`flex items-end gap-3 ${
                                        message.sender === currentUser ? "justify-end" : "justify-start"
                                    }`}
                                >
                                    {message.sender !== currentUser && (
                                        <img
                                            src={`https://robohash.org/${message.sender}.png?set=set4&size=40x40`}
                                            alt={`${message.sender}'s avatar`}
                                            className="w-8 h-8 rounded-full flex-shrink-0"
                                        />
                                    )}
                                    <div
                                        className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl shadow ${
                                            message.sender === currentUser
                                                ? "bg-indigo-500 text-white rounded-br-none"
                                                : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none"
                                        }`}
                                    >
                                        <div className="flex items-center mb-1">
                                            <p className="font-semibold text-sm">
                                                {message.sender !== currentUser && message.sender}
                                            </p>
                                        </div>
                                        <div className="prose prose-sm dark:prose-invert prose-p:my-0 prose-a:text-indigo-300 hover:prose-a:text-indigo-200">
                                            <ReactMarkdown
                                                components={{
                                                    a: ({node, ...props}) => (
                                                        <a
                                                            {...props}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="underline"
                                                        />
                                                    ),
                                                }}
                                            >
                                                {message.content}
                                            </ReactMarkdown>
                                        </div>
                                        <p className="text-xs text-right mt-1 opacity-70">
                                            {timeAgo(message.timeStamp)}
                                        </p>
                                    </div>
                                    {message.sender === currentUser && (
                                        <img
                                            src={`https://robohash.org/${currentUser}.png?set=set4&size=40x40`}
                                            alt="My avatar"
                                            className="w-8 h-8 rounded-full flex-shrink-0"
                                        />
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </main>

            {/* --- CHANGE 6: Added Frosted Glass effect to Footer --- */}
            <footer className="flex-shrink-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-t-md z-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative py-3">
                        {showEmojiPicker && (
                            <div className="absolute bottom-full left-0 pb-2">
                                <EmojiPicker
                                    onEmojiClick={(emojiObject) => {
                                        setInput((prev) => prev + emojiObject.emoji);
                                        setShowEmojiPicker(false);
                                    }}
                                    theme={darkMode ? "dark" : "light"}
                                />
                            </div>
                        )}
                        <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-full p-2">
                            <button
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                                aria-label="Toggle Emoji Picker"
                            >
                                <MdOutlineEmojiEmotions className="text-yellow-500 text-2xl" />
                            </button>
                            <input
                                type="text"
                                className="w-full bg-transparent focus:outline-none text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                placeholder="Type a message..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            />
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{display: "none"}}
                                onChange={handleFileSelect}
                            />
                            <button
                                onClick={() => fileInputRef.current.click()}
                                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                                aria-label="Attach File"
                            >
                                <MdAttachFile className="text-gray-500 dark:text-gray-400 text-2xl" />
                            </button>
                            <button
                                onClick={sendMessage}
                                className="p-2 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-all duration-200"
                                disabled={!input.trim()}
                                aria-label="Send Message"
                            >
                                <MdSend className="text-2xl" />
                            </button>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default ChatPage;

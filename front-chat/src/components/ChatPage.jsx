import React from "react";
import {MdSend, MdAttachFile, MdOutlineEmojiEmotions, MdLightMode, MdDarkMode} from "react-icons/md";
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

const ChatPage = () => {
    const {roomId, currentUser, connected, setConnected, setRoomId, setCurrentUser} = useChatContext();
    // console.log(roomId);
    // console.log(currentUser);
    // console.log(connected);

    const navigate = useNavigate();
    useEffect(() => {
        if (!connected) {
            navigate("/");
        }
    }, [roomId, currentUser, connected]);

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [stompClient, setStompClient] = useState(null);
    //const [roomId, setRoomId] = useState("");
    const inputRef = useRef(null);
    const chatBoxRef = useRef(null);
    //const [currentUser] = useState("Aditi");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [darkMode, setDarkMode] = useState(() => {
        const storedTheme = localStorage.getItem("theme");
        return storedTheme ? storedTheme === "dark" : false; // Default to light mode if undefined
    });

    // function for uploaing the file
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
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                const {fileId, fileName} = response.data;

                const message = {
                    sender: currentUser,
                    content: `📎 [${file.name}](http://localhost:8080/api/files/${fileId})`,
                    roomId: roomId,
                };

                stompClient.send(`/app/sendMessage/${roomId}`, {}, JSON.stringify(message));
            } catch (error) {
                console.error("File upload failed:", error);
                toast.error("File upload failed");
            }
        }
    };

    ///page init:

    // load the old messages
    useEffect(() => {
        async function loadMessages() {
            try {
                const messages = await getMessages(roomId);
                // console.log(messages);
                setMessages(messages);
            } catch (error) {}
        }
        if (connected) {
            loadMessages();
        }
    }, []);

    // init StopmClient
    // subscribe to StompClient
    useEffect(() => {
        const connectWebSocket = () => {
            ///SockJS
            const sock = new SockJS(`${baseURL}/chat`);
            const client = Stomp.over(sock);

            client.connect({}, () => {
                setStompClient(client);

                toast.success("connected");

                client.subscribe(`/topic/room/${roomId}`, (message) => {
                    console.log(message);

                    const newMessage = JSON.parse(message.body);

                    setMessages((prev) => [...prev, newMessage]);

                    //rest of the work after success receiving the message
                });
            });
        };

        if (connected) {
            connectWebSocket();
        }

        //stomp client
    }, [roomId]);

    //send message Handler
    const sendMessage = async () => {
        if (stompClient && connected && input.trim()) {
            console.log(input);

            const message = {
                sender: currentUser,
                content: input,
                roomId: roomId,
            };

            stompClient.send(`/app/sendMessage/${roomId}`, {}, JSON.stringify(message));
            setInput("");
        }
    };

    // Scroll to bottom when messages update
    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);

    // for dark mode or light mode
    useEffect(() => {
        document.documentElement.classList.toggle("dark", darkMode);
        localStorage.setItem("theme", darkMode ? "dark" : "light");
    }, [darkMode]);

    // function for handle log out
    function handleLogOut() {
        stompClient.disconnect();
        setConnected(false);
        setRoomId("");
        setCurrentUser("");
        navigate("/");
    }

    return (
        <div className="">
            {/* header */}
            <header className="h-20 fixed w-full bg-gray-200 dark:bg-gray-900 shadow py-5 flex justify-around items-center p-5">
                {/*room name container */}
                <div>
                    <h1 className="text-xl font-semibold">
                        Room : <span>{roomId}</span>
                    </h1>
                </div>
                {/* user name container */}
                <div>
                    <h1 className="text-xl font-semibold">
                        User : <span>{currentUser}</span>
                    </h1>
                </div>
                {/* button : Leave Room */}
                <div>
                    <button
                        onClick={handleLogOut}
                        className="px-3 py-2 rounded-lg 
                    bg-red-500 text-white hover:bg-red-700 
                    dark:bg-red-500 dark:hover:bg-red-700"
                    >
                        Leave Room
                    </button>
                </div>

                {/* toggle button for dark mode or light mode */}
                <button onClick={() => setDarkMode(!darkMode)} className="text-2xl">
                    {darkMode !== undefined ? (
                        darkMode ? (
                            <MdLightMode className="text-yellow-400" />
                        ) : (
                            <MdDarkMode className="text-gray-800" />
                        )
                    ) : null}
                </button>
            </header>

            {/* Chat Container */}
            <main
                ref={chatBoxRef}
                className="flex-grow pt-20 py-6 w-2/3 bg-white dark:bg-slate-600 mx-auto 
                min-h-screen max-h-screen overflow-auto pb-20
                rounded-lg shadow-lg dark:border dark:border-gray-700"
            >
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`mb-4 flex ${
                            message.sender === currentUser ? "justify-end" : "justify-start"
                        } items-start gap-3`}
                    >
                        {message.sender !== currentUser && (
                            <img
                                src={`https://robohash.org/${message.sender}.png?size=40x40`}
                                alt="avatar"
                                className="w-10 h-10 rounded-full border dark:border-gray-600 dark:bg-gray-900 shadow-md"
                            />
                        )}

                        <div
                            className={`p-3 rounded-lg shadow-md max-w-lg ${
                                message.sender === currentUser ? "bg-cyan-600 text-white" : "bg-gray-800 text-gray-300"
                            }`}
                        >
                            <h1 className="font-semibold text-white">{message.sender}</h1>
                            <ReactMarkdown
                                components={{
                                    a: ({node, ...props}) => (
                                        <a
                                            {...props}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-400 underline hover:text-blue-600"
                                        />
                                    ),
                                }}
                            >
                                {message.content}
                            </ReactMarkdown>
                            <p className="text-xs text-gray-600">{timeAgo(message.timeStamp)}</p>
                        </div>

                        {message.sender === currentUser && (
                            <img
                                src={`https://robohash.org/${message.sender}.png?size=40x40`}
                                alt="avatar"
                                className="w-10 h-10 rounded-full border dark:border-gray-600 dark:bg-gray-900 shadow-md"
                            />
                        )}
                    </div>
                ))}
            </main>

            {/* input message container */}
            <div className="fixed bottom-4 w-full flex justify-center">
                <div
                    className="h-16 w-1/2 flex items-center gap-3 px-6 
                    bg-gray-200 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 
                    shadow-lg rounded-full relative"
                >
                    {/* Emoji Picker Button */}
                    <button
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="text-yellow-400 text-2xl focus:outline-none"
                    >
                        <MdOutlineEmojiEmotions />
                    </button>

                    {/* Emoji Picker (Show only when enabled) */}
                    {showEmojiPicker && (
                        <div className="absolute bottom-16 left-0 z-50">
                            <EmojiPicker
                                onEmojiClick={(emojiObject) => {
                                    setInput((prev) => prev + emojiObject.emoji);
                                    setShowEmojiPicker(false); // Auto-close after selecting
                                }}
                            />
                        </div>
                    )}

                    {/* Input Field */}
                    <input
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                sendMessage();
                            }
                        }}
                        type="text"
                        className="w-full h-10 dark:bg-gray-800 px-5 py-2 text-white placeholder-gray-400 
                        border-none rounded-full focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
                        placeholder="Type your message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />

                    {/* Send & Attach Buttons */}
                    <div className="flex gap-3">
                        <>
                            {/* Hidden File Input */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{display: "none"}}
                                onChange={handleFileSelect}
                            />

                            {/* Attachment Button */}
                            <button
                                className="bg-gradient-to-r from-green-500 to-teal-500 px-4 py-2 rounded-full 
                                    flex justify-center items-center shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
                                onClick={() => fileInputRef.current.click()} // Triggers file input
                            >
                                <MdAttachFile size={22} className="text-white" />
                            </button>
                        </>

                        <button
                            onClick={() => {
                                sendMessage();
                                setInput(""); // Clear input after sending
                            }}
                            className="bg-gradient-to-r from-green-500 to-teal-500 px-4 py-2 rounded-full flex justify-center items-center shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
                        >
                            <MdSend size={22} className="text-white" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;

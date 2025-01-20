import { useContext, useEffect, useState } from "react";
import { LoggedinCtx } from "../App";
import { Link } from "react-router-dom";
import axios from "axios";
import leftArrow from '../assets/icon/left_arrow.png';

export default function Inbox() {
    const { isLoggedIn } = useContext(LoggedinCtx);
    const [menfesList, setMenfesList] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [replyForm, setReplyForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [targetUsername, setTargetUsername] = useState('');
    const [success, setSuccess]= useState("");
    const [successColor, setSuccessColor] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const visibility = "private";
    const URL = `${import.meta.env.VITE_BACKEND_URL}menfes/private/`;
    const replyURL = `${import.meta.env.VITE_BACKEND_URL}menfes/`;

    const fetchMenfes = async () => {
        setLoading(true);
        try {
            const response = await axios.get(URL, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setMenfesList(response.data);
        } catch (err) {
            console.error(err.response);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            fetchMenfes();
        }
    }, [isLoggedIn]);

    const handleSelectMessage = (message) => {
        setSelectedMessage(message);
        setReplyForm(false);
    };

    const handleSubmit = async () => {
        setTargetUsername(selectedMessage.username);
        setIsSubmitting(true);

        
        try {
            if (!message) {
                setSuccessColor(false);
                setSuccess("Please input menfes");
                return;
            }

          const response = await fetch(`${replyURL}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
              message,
              visibility,
              targetUsername: targetUsername,
            }),
          });
    
          const result = await response.json();
          if (response.ok) {
              setSuccessColor(true);
              setMessage('');
            } else {
                alert(result.error || 'Failed to send menfes!');
            }
            setSuccess(result.message);
          console.log(result)
        } catch (err) {
          console.error(err);
          alert('An error occurred');
        } finally {
            setIsSubmitting(false);
        }
      };
    
      const handleReplyForm = () => {
        setReplyForm(!replyForm);
        setTargetUsername(selectedMessage.username);
        console.log(selectedMessage.username)
      }

    return (
        <>
            {isLoggedIn ? (
                <div className="inbox-container grid grid-cols-3 h-screen">
                {/* Sidebar */}
                <div className="sidebar bg-pink-50 text-pink-800 shadow-lg border-r border-pink-200 overflow-y-auto">
                    <p className="text-center text-lg font-bold p-4 border-b border-pink-300">
                        Your inbox ({menfesList.length})
                    </p>
                    {loading ? (
                        <p className="text-center mt-4 text-pink-500">Loading messages...</p>
                    ) : menfesList.length === 0 ? (
                        <p className="text-center mt-4 text-pink-500">No messages!</p>
                    ) : (
                        <ul className="p-2 space-y-2">
                            {menfesList.map((message, index) => (
                                <li
                                    key={index}
                                    className={`p-3 cursor-pointer rounded-md transition hover:bg-pink-100 ${
                                        selectedMessage === message
                                            ? "bg-pink-200 text-pink-900"
                                            : ""
                                    }`}
                                    onClick={() => handleSelectMessage(message)}
                                >
                                    <p className="font-semibold">{message.username}</p>
                                    <p className="text-sm text-pink-600 truncate">
                                        {message.message}
                                    </p>
                                    <p className="text-xs text-pink-400">
                                        {new Date(message.created_at).toLocaleString(
                                            "id-ID",
                                            {
                                                dateStyle: "medium",
                                                timeStyle: "short",
                                            }
                                        )}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            
                {/* Message Content */}
                <div className="message-content col-span-2 bg-white p-6 shadow-lg rounded-md">
                    {selectedMessage ? (
                        <>
                            {replyForm ? (
                                <div>
                                    <img
                                        src={leftArrow}
                                        className="w-6 mb-4 cursor-pointer transition hover:opacity-80"
                                        onClick={() => setReplyForm(false)}
                                    />
                                    <div className="max-w-lg mx-auto p-4 bg-pink-50 shadow-md rounded-lg">
                                        <h2 className="text-xl font-bold text-pink-700 mb-4">
                                            Reply to {selectedMessage.username}
                                        </h2>
                                        <textarea
                                            placeholder="Type your reply..."
                                            name="message"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            className="w-full p-3 h-32 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 bg-pink-100"
                                        />
                                        {success && (
                                            <p
                                                className={`mt-3 p-2 rounded-md text-center ${
                                                    successColor
                                                        ? "bg-pink-100 text-pink-800"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {success}
                                            </p>
                                        )}
                                        <button
                                            onClick={handleSubmit}
                                            disabled={isSubmitting}
                                            className={`w-full mt-4 py-2 rounded-md font-semibold transition ${
                                                isSubmitting
                                                    ? "bg-pink-300 text-white"
                                                    : "bg-pink-500 hover:bg-pink-600 text-white"
                                            }`}
                                        >
                                            {isSubmitting ? "Sending..." : "Send Reply"}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <div>
                                            <p className="text-xl font-bold text-pink-800">
                                                {selectedMessage.username}
                                            </p>
                                            <p className="text-sm text-pink-500">
                                                Sent at:{" "}
                                                {new Date(
                                                    selectedMessage.created_at
                                                ).toLocaleString("id-ID", {
                                                    dateStyle: "medium",
                                                    timeStyle: "short",
                                                })}
                                            </p>
                                        </div>
                                        <button
                                            onClick={handleReplyForm}
                                            className="px-4 py-2 rounded-md bg-pink-500 text-white font-medium hover:bg-pink-600 transition"
                                        >
                                            Reply →
                                        </button>
                                    </div>
                                    <div className="bg-pink-50 p-4 rounded-md shadow-sm">
                                        <p className="text-pink-800">{selectedMessage.message}</p>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex justify-center items-center h-full text-center text-pink-500">
                            <p>Select a message to view details</p>
                        </div>
                    )}
                </div>
            </div>                     
            ) : (
                <div className="flex justify-center items-center flex-col gap-4 h-screen">
                    <p className="text-2xl font-bold text-slate-300">
                        Sorry, you {"can't"} access this page!
                    </p>
                    <p className="text-3xl font-bold text-slate-300">
                        You {"aren't"}{" "}
                        <span className="underline cursor-pointer hover:text-sky-500 transition-colors duration-200">
                            <Link to="/login">sign in</Link>
                        </span>{" "}
                        yet!
                    </p>
                </div>
            )}
        </>
    );
}
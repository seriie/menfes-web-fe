import axios from "axios";
import { useContext, useEffect, useState, useCallback } from "react";
import { IsAdminCtx, IsOwnerCtx, LoggedinCtx } from "../App";
import { useNavigate } from "react-router-dom";
import profileIcon from "../assets/image/profile_icon.png";
import anonymousProfileIcon from "../assets/image/anonymous_profile_icon.png"
import adminRoleIcon from '../assets/icon/admin_role_icon.png';
import ownerRoleIcon from '../assets/icon/owner_role_icon.png';
import '../App.css';

export default function Home() {
    const [menfes, setMenfes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [isLiked, setIsLiked] = useState({});
    const [reply, setReply] = useState(null);
    const [replyMessage, setReplyMessage] = useState('');
    const [comments, setComments] = useState([]);
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [replyLoading, setReplyLoading] = useState(false);
    const { isLoggedIn } = useContext(LoggedinCtx);
    const { isAdmin } = useContext(IsAdminCtx);
    const { isOwner } = useContext(IsOwnerCtx);
    const navigate = useNavigate();
    const URL = import.meta.env.VITE_BACKEND_URL;
    const API_KEY = import.meta.env.VITE_MENFES_API_KEY;

    const getMenfes = useCallback(async () => {
        try {
            const response = await axios.get(`${URL}menfes/public`);
            setMenfes(response.data);
            setLoading(false);
        } catch (e) {
            setError(e.response?.data || "Error fetching data");
        }
    }, []);

    useEffect(() => {
        getMenfes();
    }, [getMenfes]);
    
    useEffect(() => {
        if (isLoggedIn && menfes.length > 0) {
            Promise.all(menfes.map(item => handleCheckLikes(item.id)));
        }
    }, [menfes, isLoggedIn]);      

    const toggleDropdown = (index) => {
        setSelectedMessage(selectedMessage === index ? null : index);
    };

    const toggleReply = (index, id) => {
        setReply(reply === index ? null : index);
        getReplyMessage(id);
    };

    const handleDeleteMessage = async (id) => {
        setSelectedMessage(null);
        try {
            await axios.delete(`${URL}menfes/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            getMenfes();
        } catch (error) {
            console.error("Delete error:", error.response?.data || error.message);
        }
    };

    const handlePinMessage = async (id) => {
        try {
            await axios.patch(`${URL}menfes/${id}/pin`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            getMenfes();
        } catch (error) {
            console.error("Pin error:", error.response?.data || error.message);
        }
    };

    const handleLikeMenfes = async (id) => {
        try {
            await axios.post(`${URL}menfes/likes`, {
                menfes_id: id
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setIsLiked(prev => ({ ...prev, [id]: !prev[id] }));
            getMenfes();
        } catch (e) {
            console.error("Like error:", e.response?.data || e.message);
        }
    };    

    const handleCheckLikes = async (id) => {
        try {
            const { data } = await axios.get(`${URL}menfes/${id}/liked`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
    
            setIsLiked(prev => {
                if (prev[id] === data.liked) return prev;
                return { ...prev, [id]: data.liked };
            });
        } catch (e) {
            console.error("Check likes error:", e.response?.data || e.message);
        }
    };    

    const handleReplyMessage = async (id) => {
        try {
            const response = await axios.post(`${URL}menfes/reply/${id}`, {
                reply_message: replyMessage
            }, {
                headers: {
                    'Authorization' : `Bearer ${localStorage.getItem('token')}`
                }
            });

            setMessage(response.data.message);
            setSuccess(true);
            setReplyMessage('')
            console.log(response)
        } catch (e) {
            console.error("Reply message error:", e.response?.data || e.message);
            setMessage(e.response?.data.message);
            console.log(e)
            setSuccess(false);
        }
    }

    const getReplyMessage = async (id) => {
        setReplyLoading(true);
        try {
            const response = await axios.get(`${URL}menfes/reply/${id}?KEY=${API_KEY}`, {
                headers : {
                    'Authorization' : `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            // setReplyLoading(false);
            setComments(response.data || []);
            console.log(response);
        } catch (e) {
            console.error("Error get reply message", e)
            // setReplyLoading(false);
        } finally {
            setReplyLoading(false);
        }
    }
    
    const handleProfileClick = (username) => {
        navigate(`/profiles/${username}`);
    };

    const displayedMessages = [...menfes].sort((a, b) => b.pinned - a.pinned);

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-gray-50">
            <aside className="lg:w-1/4 bg-pink-200 p-4 lg:h-full shadow-lg">
                <button
                    className="text-slate-200 text-xl font-medium rounded-md bg-pink-600 p-4"
                    onClick={() => isLoggedIn ? navigate('/create-menfes') : navigate('/login')}
                >
                    Create your menfes
                </button>
            </aside>

            {/* Main Content */}
            <main className="custom-scrollbar flex-1 p-6 overflow-y-auto">
                <h1 className="text-3xl font-bold text-pink-600 mb-6">Menfes...</h1>
                {isLoggedIn ? (
                    <>
                        {loading ? (
                            <p className="text-center text-pink-500">Loading...</p>
                        ) : error ? (
                            <p className="text-center text-red-500">{error}</p>
                        ) : (
                            <div className="space-y-4">
                                {displayedMessages.map((item, index) => (
                                    <>
                                    <div
                                        key={item.id}
                                        onDoubleClick={() => handleLikeMenfes(item.id)}
                                        className={`${item.role == 'owner' && !item.anonymous == 1 ? 'bg-gradient-to-r from-slate-50 to-red-300 border-2 border-red-500' : 'bg-white'} ${item.role == 'admin' && !item.anonymous == 1 ? 'bg-gradient-to-r from-slate-50 to-yellow-300 border-2 border-yellow-500' : ''} p-4 relative shadow-md items-center rounded-lg flex justify-between space-x-4 hover:shadow-lg 
                                        ${item.pinned == 1 && item.anonymous == 1 ? 'border-2 bg-gradient-to-r from-white to-slate-500 border-slate-500' : item.pinned == 1 && !item.anonymous == 1 && 'border-2 bg-gradient-to-r from-white to-pink-200 border-pink-500'}`}
                                    >
                                        {item.pinned == 1 && <i className='fa-solid fa-thumbtack text-slate-500 absolute top-1 left-1'></i>}
                                        <div className="flex space-x-4">
                                            <img
                                                src={item.anonymous == 1 ? anonymousProfileIcon :    item.profile_picture ? item.profile_picture : profileIcon}
                                                alt="Profile"
                                                className="w-10 h-10 object-cover rounded-full border border-pink-300"
                                            />
                                            
                                            <div>
                                                <div className="flex gap-1 items-center">
                                                    <h3 
                                                        onClick={() => {
                                                            if (item.anonymous == 1 && !isOwner) return;
                                                            handleProfileClick(item.username);
                                                        }}  
                                                        className={`${item.anonymous == 1 ? 'text-slate-700' : 'text-pink-700'} hover:underline cursor-pointer text-xs sm:text-sm md:text-base font-semibold`}>
                                                        {item.anonymous == 1 ? 'Anonymous' : item.username + ' |'}
                                                    </h3>
                                                    <div className="flex items-center gap-1">
                                                        <span className={`text-xs sm:text-sm md:text-base ${item.role === 'owner' ? 'text-red-500' : item.role === 'admin' ? 'text-yellow-500' : 'text-slate-400'} font-normal italic`}>{item.anonymous == 1 ? '' : item.role}</span>
                                                        {item.anonymous == 1 ? '' : (item.role === 'owner' ? <img className="w-4" src={ownerRoleIcon} /> : item.role === 'admin' ? <img className="w-3" src={adminRoleIcon} /> : '')}
                                                    </div>
                                                    <i className="text-slate-400 text-xs sm:text-sm md:text-base">| {item.created_at}</i>
                                                </div>
                                                <p className="text-gray-800 text-sm md:text-base break-all">{item.message}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="flex gap-1 items-center w-full text-left mx-2">
                                                <button className="flex items-center gap-2 text-gray-600">
                                                    <i onClick={() => handleLikeMenfes(item.id)} className={`cursor-pointer fa-solid fa-heart ${isLiked[item.id] ? 'text-red-500' : ''}`}></i>
                                                </button>
                                                <span className="text-gray-600">{item.total_likes}</span>
                                            </div>
                                            <span 
                                                className="text-xl cursor-pointer"
                                                onClick={() => toggleDropdown(index)}
                                            >
                                                &#9868;
                                            </span>
                                        </div>

                                        {selectedMessage === index && (
                                            <div onClick={() => setSelectedMessage(!selectedMessage)} className="absolute z-10 right-3 top-14 bg-white border shadow-md rounded-md p-1">
                                                {isAdmin || isOwner ? (
                                                    <div>
                                                        <div onClick={() => handleDeleteMessage(item.id)} className="flex cursor-pointer gap-3 items-center w-full text-left p-2 hover:bg-gray-100">
                                                            <button className="text-red-500 block">Delete</button>
                                                            <i className="fas fa-trash text-red-500"></i>
                                                        </div>
                                                        
                                                        <div onClick={() => handlePinMessage(item.id)} className="flex cursor-pointer gap-3 items-center w-full text-left p-2 hover:bg-gray-100">
                                                            <button className="text-sky-500 block">
                                                                {item.pinned ? "Unpin" : "Pin"}
                                                            </button>
                                                            <i className={`fa-solid fa-thumbtack ${item.pinned ? 'text-gray-500' : 'text-sky-500'}`}></i>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <button className="block w-full text-left p-2 hover:bg-gray-100">Report</button>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    {reply == index && (
                                        <>
                                            
                                            {replyLoading ? <p className="text-gray-500 text-center font-medium text-lg">Loading...</p> : <p className="text-center w-full border-b-2 border-slate-400 text-slate-600 font-medium text-xl">{comments.length > 0 ? `(${comments.length})` : 'No'} Replies</p>}
                                            {comments.map((comment, idx) => (
                                                <>
                                                    <div className="space-y-2">
                                                        <div key={comment.id} className="bg-white p-2 relative shadow-md items-center rounded-lg flex justify-between space-x-2 hover:shadow-lg">
                                                            <div className="flex space-x-2">
                                                                <img src={comment.profile_picture} alt={`${comment.username} profile`} className="w-8 h-8 object-cover rounded-full border border-pink-300" />
                                                                <div>
                                                                    <div className="flex gap-1 items-center">
                                                                        <h3 
                                                                            onClick={() => {
                                                                                if (!isOwner) return;
                                                                                handleProfileClick(comment.username);
                                                                            }}  
                                                                            className={`text-pink-700 hover:underline cursor-pointer text-sm font-semibold`}>
                                                                            {comment.username} |
                                                                        </h3>
                                                                        <div className="flex items-center gap-1">
                                                                            <span className={`text-sm ${comment.role === 'owner' ? 'text-red-500' : comment.role === 'admin' ? 'text-yellow-500' : 'text-slate-400'} font-normal italic`}>{comment.role}</span>
                                                                            {comment.role === 'owner' ? <img className="w-3" src={ownerRoleIcon} /> : comment.role === 'admin' ? <img className="w-3" src={adminRoleIcon} /> : ''}
                                                                        </div>
                                                                        <i className="text-slate-400 text-sm">| {comment.created_at}</i>
                                                                    </div>
                                                                    <p className="text-gray-800 text-sm break-all">{comment.reply_message}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            ))}
                                            <div className="flex items-center">
                                                <input value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)} type="text" placeholder="Reply..." className=" reply-input bg-slate-300 text-slate-800 rounded-tl-full rounded-bl-full w-full p-2 focus:outline-none placeholder:text-slate-60"></input>
                                                <button onClick={() => handleReplyMessage(item.id)} type="submit" className="p-2 bg-pink-500 rounded-br-full font-medium rounded-tr-full text-slate-100">Reply</button>
                                            </div>
                                            {message && (
                                                <p className={`${success ? 'text-green-500' : 'text-red-500'}`}>{message}</p>
                                            )}
                                        </>
                                    )}
                                   <div onClick={() => toggleReply(index, item.id)}>
                                        <p className="text-gray-500 cursor-pointer inline-block items-center">
                                            {reply === index ? "Hide Reply" : "Show Reply"}
                                        </p>
                                    </div>

                                </>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full flex-col">
                        <p className="text-slate-400 text-center text-xl sm:text-2xl md:text-3xl font-medium">A world of secrets awaits...</p>
                        <p className="text-slate-400 text-center text-xl sm:text-2xl md:text-3xl font-medium">
                            Log in to uncover (<span className="text-red-500">{menfes.length}</span>) hidden menfes.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}

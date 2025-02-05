import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { IsAdminCtx, LoggedinCtx } from "../App";
import { useNavigate } from "react-router-dom";
import profileIcon from "../assets/image/profile_icon.png";
import adminRoleIcon from '../assets/icon/admin_role_icon.png';
import ownerRoleIcon from '../assets/icon/owner_role_icon.png';
import '../App.css';

export default function Home() {
    const [menfes, setMenfes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [isLiked, setIsLiked] = useState({});
    const { isLoggedIn } = useContext(LoggedinCtx);
    const { isAdmin } = useContext(IsAdminCtx);
    const navigate = useNavigate();
    const URL = import.meta.env.VITE_BACKEND_URL;

    const getMenfes = async () => {
        try {
            const response = await axios.get(`${URL}menfes/public`);
            setMenfes(response.data);
            setLoading(false);
        } catch (e) {
            setError(e.response?.data || "Error fetching data");
        }
    };    

    useEffect(() => {
        getMenfes();
    }, []);
    
    useEffect(() => {
        if (isLoggedIn && menfes.length > 0) {
            menfes.forEach((item) => {
                handleCheckLikes(item.id);
            });
        }
    }, [menfes, isLoggedIn]);    

    const toggleDropdown = (index) => {
        setSelectedMessage(selectedMessage === index ? null : index);
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
            const response = await axios.get(`${URL}menfes/${id}/liked`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setIsLiked(prev => ({ ...prev, [id]: response.data.liked }));
        } catch (e) {
            console.error("Check likes error:", e.response?.data || e.message);
        }
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
                                    <div
                                        key={index}
                                        className={`bg-white p-4 relative shadow-md items-center rounded-lg flex justify-between space-x-4 hover:shadow-lg 
                                        ${item.pinned == 1 ? 'border-2 bg-gradient-to-r from-white to-yellow-200 border-yellow-500' : ''}`}
                                    >
                                        {item.pinned == 1 && <i className='fa-solid fa-thumbtack text-slate-500 absolute top-1 left-1'></i>}
                                        <div className="flex space-x-4">
                                            <img
                                                src={item.profile_picture ? item.profile_picture : profileIcon}
                                                alt="Profile"
                                                className="w-10 h-10 object-cover rounded-full border border-pink-300"
                                            />
                                            
                                            <div>
                                                <div className="flex gap-1 items-center">
                                                    <h3 className="text-pink-700 text-xs sm:text-sm md:text-base font-semibold">{item.username} |</h3>
                                                    <div className="flex items-center gap-1">
                                                        <span className={`text-xs sm:text-sm md:text-base ${item.role === 'owner' ? 'text-red-500' : item.role === 'admin' ? 'text-yellow-500' : 'text-slate-400'} font-normal italic`}>{item.role}</span>
                                                        {item.role === 'owner' ? <img className="w-4" src={ownerRoleIcon} /> : item.role === 'admin' ? <img className="w-3" src={adminRoleIcon} /> : ''}
                                                    </div>
                                                    <i className="text-slate-400 text-xs sm:text-sm md:text-base">| {new Date(item.created_at).toLocaleString("id-ID", {dateStyle: "short", timeStyle: "short"})}</i>
                                                </div>
                                                <p className="text-gray-800 text-sm md:text-base break-all">{item.message}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <div onClick={() => handleLikeMenfes(item.id)} className="flex cursor-pointer gap-1 items-center w-full text-left p-2 hover:bg-gray-100">
                                                <button className="flex items-center gap-2 text-gray-600">
                                                    <i className={`fa-solid fa-heart ${isLiked[item.id] ? 'text-red-500' : ''}`}></i>
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
                                                {isAdmin ? (
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
                                                    <button className="block w-full text-left p-2 hover:bg-gray-100">Report</button>
                                                )}
                                                <div onClick={() => handleLikeMenfes(item.id)} className="flex cursor-pointer gap-1 items-center w-full text-left p-2 hover:bg-gray-100">
                                                    <button className="flex items-center gap-2 text-gray-600">
                                                        <p>Likes</p>
                                                        <i className={`fa-solid fa-heart ${isLiked[item.id] ? 'text-red-500' : ''}`}></i>
                                                    </button>
                                                    <span className="text-gray-600">{item.total_likes}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
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

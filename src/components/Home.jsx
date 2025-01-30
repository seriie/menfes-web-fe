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

    const toggleDropdown = (index) => {
        setSelectedMessage(selectedMessage === index ? null : index);
    };

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-gray-50">
            {/* Sidebar */}
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
                                {menfes.map((item, index) => (
                                    <div
                                        key={index}
                                        className="bg-white p-4 relative shadow-md rounded-lg flex justify-between space-x-4 hover:shadow-lg"
                                    >
                                        {/* Profile Picture */}
                                        <div className="flex space-x-4">
                                            {item.profile_picture ? (
                                                <img
                                                    src={item.profile_picture}
                                                    alt="Profile"
                                                    className="w-10 h-10 object-cover rounded-full border border-pink-300"
                                                />
                                            ) : (
                                                <img
                                                    src={profileIcon}
                                                    alt="Profile"
                                                    className="w-10 h-10 object-cover rounded-full border border-pink-300"
                                                />
                                            )}
                                            {/* Message Content */}
                                            <div className="">
                                                <div className="flex gap-1">
                                                    <h3 className="text-pink-700 font-semibold">{item.username} |</h3>
                                                    <div className="flex items-center gap-1">
                                                        <span className={`${item.role == 'owner' ? 'text-red-500' : item.role == 'admin' ? 'text-yellow-500' : 'text-slate-400'} font-normal italic`}>{item.role}</span>
                                                        <span>{item.role == 'owner' ? <img className="w-4" src={ownerRoleIcon}/> : item.role == 'admin' ? <img className="w-3" src={adminRoleIcon}/> : ''}</span>
                                                    </div>
                                                </div>
                                                <p className="text-gray-800 break-all">{item.message}</p>
                                            </div>
                                        </div>
                                        {/* Dropdown Toggle */}
                                        <span 
                                            className="text-xl cursor-pointer"
                                            onClick={() => toggleDropdown(index)}
                                        >
                                            &#9868;
                                        </span>

                                        {/* Dropdown */}
                                        {selectedMessage === index && (
                                            <div className="absolute z-10 right-3 top-10 bg-white border shadow-md rounded-md p-2">
                                                {isAdmin ? (
                                                    <>
                                                        <button className="block w-full text-left p-2 hover:bg-gray-100">Delete</button>
                                                        <button className="block w-full text-left p-2 hover:bg-gray-100">Pin</button>
                                                    </>
                                                ) : (
                                                    <button className="block w-full text-left p-2 hover:bg-gray-100">Report</button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-slate-400 text-3xl font-medium">You {"aren't"} signed in</p>
                    </div>
                )}
            </main>
        </div>
    );
}
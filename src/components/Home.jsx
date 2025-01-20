import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { LoggedinCtx } from "../App";
import { useNavigate } from "react-router-dom";
import profileIcon from "../assets/image/profile_icon.png";

export default function Home() {
    const [menfes, setMenfes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { isLoggedIn } = useContext(LoggedinCtx);
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
                {/* <nav className="mt-6 space-y-4">
                    <a href="#" className="block text-pink-800 font-semibold hover:text-pink-500">
                        Home
                    </a>
                    <a href="#" className="block text-pink-800 font-semibold hover:text-pink-500">
                        Public Menfes
                    </a>
                    <a href="#" className="block text-pink-800 font-semibold hover:text-pink-500">
                        My Messages
                    </a>
                </nav> */}
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 overflow-y-auto">
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
                                        className="bg-white p-4 items-start shadow-md rounded-lg flex space-x-4 hover:shadow-lg"
                                    >
                                        {/* Profile Picture */}
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
                                        <div>
                                            <h3 className="text-pink-700 font-semibold">{item.username}</h3>
                                            <p className="text-gray-800">{item.message}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <div className="flex items-center justify-center h-full">
                            <p className="text-slate-400 text-3xl font-medium">You {"aren't"} signed in</p>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
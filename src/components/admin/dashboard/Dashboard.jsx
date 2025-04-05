import { useEffect, useState } from "react";
import { FaUser, FaUserTie } from "react-icons/fa";
import { CiViewList } from 'react-icons/ci';
import axios from "axios";

export default function Dashboard() {
    const [totalVisitors, setTotalVisitors] = useState(0);
    const [todayVisitors, setTodayVisitors] = useState(0);
    const [activeUsers, setActiveUsers] = useState(0);
    const counterItems = [
        { id: 1, name: 'Total Visitors', count: totalVisitors, icon: <FaUser className="text-white w-10 h-10" />, background: "bg-sky-500" },
        { id: 2, name: 'Visitors Today', count: todayVisitors, icon: <FaUser className="text-white w-10 h-10" />, background: "bg-green-500" },
        { id: 3, name: 'Active User', count: activeUsers, icon: <FaUser className="text-white w-10 h-10" />, background: "bg-teal-500" },
        { id: 4, name: 'Active Admin', count: 1, icon: <FaUserTie className="text-white w-10 h-10" />, background: "bg-yellow-500" },
        { id: 5, name: 'Menfes Today', count: 4, icon: <CiViewList className="text-white w-10 h-10" />, background: "bg-pink-500" }
    ];
    const URL = import.meta.env.VITE_BACKEND_URL;
    const API_KEY = import.meta.env.VITE_MENFES_API_KEY;
    
    const getTotalVisitors = async () => {
        try {
            const response = await axios.get(`${URL}visitors/total?KEY=${API_KEY}`);

            setTotalVisitors(response.data[0].total);
        } catch (e) {
            console.error("Error getting total visitors: ", e);
        }
    }

    const getTodayVisitors = async () => {
        try {
            const response = await axios.get(`${URL}visitors/today?KEY=${API_KEY}`);
            
            setTodayVisitors(response.data[0].today);
        } catch (e) {
            console.error("Error getting today visitors: ", e);
        }
    }
    
    useEffect(() => {
        getTotalVisitors();
        getTodayVisitors();
        
        const interval = setInterval(() => {
            getTotalVisitors();
            getTodayVisitors();
        }, 5000);

        return () => clearInterval(interval);
    }, []);
    
    return (
        <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {counterItems.map((item) => (
                    <div key={item.id} className={`flex p-6 items-center justify-between rounded-xl shadow-xl transition-transform transform hover:scale-105 ${item.background}`}>
                        <div className="text-white gap-1 flex flex-col font-semibold">
                            <p className="text-4xl">{item.count}</p>
                            <p className="text-lg">{item.name}</p>
                        </div>
                        {item.icon}
                    </div>
                ))}
            </div>
        </div>
    );
}
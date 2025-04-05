import { useEffect, useState } from "react";
import { FaUser } from 'react-icons/fa'
import homeIcon from '../../assets/icon/home_icon.png';
import Dashboard from "./dashboard/Dashboard";

export default function Admin() {
    const [isOpened, setIsOpened] = useState(false);
    const [selectedTab, setSelectedTab] = useState("dashboard");
    const sidebarItems = [
        { id: 1, name: "dashboard", label: 'Dashboard', icon: homeIcon, isComponent: false },
        { id: 2, name: "userManagement", label: 'User Management', icon: <FaUser className="w-7 h-7" />, isComponent: true },

    ];

    useEffect(() => {
        document.title = `Admin - ${sidebarItems.find((item) => item.name === selectedTab)?.label}`
    }, [selectedTab]);

    return (
        <>
            <div>
                <header className={`bg-pink-500 ${isOpened ? 'w-56' : 'w-12'} z-10 shadow-lg shadow-pink-500/50 p-1 transition-all duration-300 flex flex-col fixed left-0 h-full overflow-hidden`}>
                    <p onClick={() => setIsOpened(!isOpened)} className={`text-3xl ml-auto mr-2 text-slate-100 font-bold cursor-pointer`}>&#9776;</p>
                    <div className="gap-2 flex flex-col justify-center">
                        {sidebarItems.map((item) => (
                            <div onClick={() => setSelectedTab(item.name)} key={item.id} className={`p-1 transition-all duration-100 rounded-md ${selectedTab == item.name ? 'bg-pink-300' : ' hover:bg-pink-400'} text-slate-100 flex gap-2 cursor-pointer`}>
                                {item.isComponent ? item.icon : <img src={item.icon} alt={item.label} className="w-8"/>}
                                {isOpened && <p className="font-bold text-lg">{item.label}</p>}
                            </div>
                        ))}
                    </div>
                </header>
                <div className={` ml-12 transition-all duration-300 p-4`}>
                    {selectedTab == "dashboard" && <Dashboard />}
                </div>
            </div>
        </>
    )
}
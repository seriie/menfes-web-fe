import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Profile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const URL = import.meta.env.VITE_BACKEND_URL;

  const getProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found!");
        return;
      }

      const response = await axios.get(
        `${URL}profile/profiles/${username}?KEY=${import.meta.env.VITE_MENFES_API_KEY}`);
    
    setProfile(response.data);
  } catch (e) {
    console.error("Error fetching profile:", e.response?.data || e.message);
  }
};

  useEffect(() => {
      
    getProfile();
  }, [username]);  

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-pink-600 mb-6">{profile.username}'s Profile</h1>
      <div className="bg-white p-6 rounded-lg shadow-md border-2 border-pink-200 w-80 text-center">
        <img
          src={profile.profile_picture ? `${URL}${profile.profile_picture}` : "https://via.placeholder.com/100"}
          alt={profile.username}
          className={`w-24 h-24 rounded-full object-cover mx-auto border-4 ${
            profile.role === "owner"
              ? "border-red-500 shadow-red-300"
              : profile.role === "admin"
              ? "border-yellow-500 shadow-yellow-300"
              : "border-gray-300"
          }`}
        />
        <h2 className="text-xl font-semibold text-gray-700 mt-3">{profile.username}</h2>
        <p className="text-sm text-gray-500">Joined: {profile.join_date}</p>
        <span
          className={`mt-2 px-3 py-1 text-sm font-semibold rounded-full ${
            profile.role === "owner"
              ? "bg-red-100 text-red-700"
              : profile.role === "admin"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {profile.role}
        </span>
      </div>
    </div>
  );
}
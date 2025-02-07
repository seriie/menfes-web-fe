import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { IsAdminCtx, IsOwnerCtx } from '../App'
import { useParams } from "react-router-dom";
import profileIcon from "../assets/image/profile_icon.png";

export default function Profile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const { isAdmin } = useContext(IsAdminCtx);
  const { isOwner } = useContext(IsOwnerCtx);
  const URL = import.meta.env.VITE_BACKEND_URL;

  // Fetch profile data
  const getProfile = async () => {
    try {

      const response = await axios.get(
        `${URL}profiles/${username}?KEY=${import.meta.env.VITE_MENFES_API_KEY}`, {
          // headers: { Authorization: `Bearer ${token}` }
        });
      
      setProfile(response.data);
      setRole(response.data.role);
    } catch (e) {
      console.error("Error fetching profile:", e.response?.data || e.message);
    }
  };

  const handleRoleChange = async (e) => {
    const newRole = e.target.value;
    setRole(newRole);

    try {
      const token = localStorage.getItem("token");
      if (!token) return console.error("No token found!");

      if (!profile || role === profile.role) return;

      const response = await axios.patch(`${URL}profile/role/${profile.id}`,
        { role: newRole },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      console.log("Role updated:", response.data);
      setMessage(response.data.message);
      setSuccess(true);
    } catch (e) {
      console.error("Error setting user role:", e.response?.data || e.message);
      setMessage(e.response?.data?.message || "Server error");
      setSuccess(false);
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
        {/* Role Management */}
        {(isAdmin || isOwner) &&
          profile.role !== "owner" &&
          !(isAdmin && profile.role === "admin") && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-pink-700 mb-2">Set Role</label>
              <select
                value={role}
                onChange={handleRoleChange}
                className="w-full p-3 border border-pink-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
              >
                <option value="user">User</option>
                {isOwner && <option value="admin">Admin</option>}
                {isOwner && <option value="owner">Owner</option>}
                {isAdmin && profile.role === "user" && <option value="admin">Admin</option>}
              </select>
            </div>
          )
        }

        {/* Profile Picture */}
        <img
          src={profile.profile_picture ? `${profile.profile_picture}` : profileIcon}
          alt={profile.username}
          className={`w-24 h-24 rounded-full object-cover mx-auto border-4 ${
            profile.role === "owner" ? "border-red-500 shadow-red-300" :
            profile.role === "admin" ? "border-yellow-500 shadow-yellow-300" :
            "border-gray-300"
          }`}
        />

        {/* User Info */}
        <h2 className="text-xl font-semibold text-gray-700 mt-3">{profile.username}</h2>
        <p className="text-sm text-gray-500">Joined: {profile.join_date}</p>

        {/* Role Badge */}
        <span className={`mt-2 px-3 py-1 text-sm font-semibold rounded-full ${
          profile.role === "owner" ? "bg-red-100 text-red-700" :
          profile.role === "admin" ? "bg-yellow-100 text-yellow-700" :
          "bg-gray-100 text-gray-700"
        }`}>
          {profile.role}
        </span>
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import profileIcon from '../assets/image/profile_icon.png';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [verifyDelete, setVerifyDelete] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullname: "",
    birth_day: "",
  });
  const navigate = useNavigate();
  
  const URL = `${import.meta.env.VITE_BACKEND_URL}profile/`;
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setProfile(response.data);
        setFormData({
          username: response.data.username,
          email: response.data.email,
          fullname: response.data.fullname,
          birth_day: response.data.birth_day,
        });
        setPreview(response.data.profile_picture);
      } catch (err) {
        console.log(err.response?.data?.message);
      }
    };
    
    fetchProfile();
    // handleConfirmDropdown();
    const confirmContainer = document.querySelector('.confirm-container');
    const verifyContainer = document.querySelector('.verify-container');
    
    if (!confirmContainer) return;
    if(!verifyContainer) return;
    
    if (confirmDelete) {
      confirmContainer.classList.add('top-4');
      confirmContainer.classList.remove('-top-64');
    } else {
      confirmContainer.classList.remove('top-4');
      confirmContainer.classList.add('-top-64');
    }
    
    if(verifyDelete) {
      verifyContainer.classList.remove('invisible');
      verifyContainer.classList.remove('opacity-0');
    } else {
      verifyContainer.classList.add('invisible');
      verifyContainer.classList.add('opacity-0');
    }
    console.log(verifyDelete)
  }, [confirmDelete, verifyDelete]);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);
  

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
    
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setUploadMessage("Invalid email format!");
      setSuccess(false);
      return;
    }
    
    try {
      const token = localStorage.getItem("token");
      const data = new FormData();
      
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      if (selectedFile) {
        data.append("profile_picture", selectedFile);
      }
      
      const response = await axios.put(
        `${URL}${profile.id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
      console.log(response);

      setProfile({ ...profile, ...formData, profile_picture: response.data.profile_picture });
      setUploadMessage(response.data.message);
      setEditMode(false);

      if (response.status === 200) {
        document.querySelector('.upload_message').classList.remove('-top-10');
        document.querySelector('.upload_message').classList.add('top-3');
        
        setTimeout(() => {
          document.querySelector('.upload_message').classList.add('-top-10');
          document.querySelector('.upload_message').classList.remove('top-3');
        }, 2000);
        setSuccess(true);
      }
    } catch (err) {
      setUploadMessage(err.response?.data?.message || "Failed to update profile!");
      setSuccess(false);
    }
  };

  if (!profile) {
    return <div className="text-center mt-5">Loading profile...</div>;
  }
  const handleVerifyDelete = () => {
    setVerifyDelete(true);
    setConfirmDelete(!confirmDelete);
  }

  const handleDeleteAccount = async (id) => {
    try {
        const pwInput = document.querySelector('.confirm-pw').value;
        if (pwInput == profile.username) {
          const response = await axios.delete(`${URL}/${id}`);
          setSuccess(true);
          console.log(axios.delete(`${URL}/${id}`));
          if (response.status ===200) {
              navigate('/login');
              localStorage.removeItem('token');
              location.reload();
          }
        } else {
          setUploadMessage("Username not match!");
          setSuccess(false);
        }
    } catch (e) {
      setUploadMessage("Failed to delete your account!");
      console.error("Error deleting account", e);
      setSuccess(false);
    }
  }

  return (
    <>
      <div className="verify-container h-screen w-full bg-pink-200 transition-opacity duration-200 invisible flex fixed inset-0 items-center justify-center text-center">
        <div className="pointer-events-auto flex flex-col gap-4 items-center justify-center text-center inset-0 h-80 w-5/12 rounded-lg bg-pink-200">
          <p
            onClick={() => setVerifyDelete(!verifyDelete)}
            className="top-5 cursor-pointer text-3xl px-8 py-6 rounded-full text-pink-800 bg-pink-200 font-bold absolute"
          >
            X
          </p>
          <div className="sign inline px-8 py-4 font-bold cursor-default text-5xl text-pink-800 rounded-full border-4 border-pink-800">
            !
          </div>
          <p className="font-bold text-pink-800">You {"can't"} take back your account!</p>
          <div className="flex-col flex">
            <input
              type="text"
              placeholder="Confirm your username"
              name="username"
              className="confirm-pw p-2 w-64 focus:ring-2 focus:ring-pink-400 focus:outline-none rounded-lg"
              autoComplete=""
            ></input>
            <button
              className="p-3 mt-2 bg-pink-800 rounded-md text-slate-100 font-bold text-xl"
              onClick={() => handleDeleteAccount(profile.id)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      <>
        <div className="confirm-container transition-all duration-200 flex fixed -top-64 left-0 right-0 items-center justify-center text-center bg-transparent">
          <div className="bg-pink-200 rounded-md px-8 py-4">
            <div className="flex items-center gap-2 justify-center">
              <div className="sign px-[10px] font-bold text-pink-800 rounded-full border-2 border-pink-800">
                !
              </div>
              <p className="font-bold text-pink-800">ARE YOU SURE?</p>
            </div>
            <div className="gap-10 flex items-center justify-center mt-4">
              <button
                onClick={() => setConfirmDelete(!confirmDelete)}
                className="px-4 py-2 font-bold bg-pink-700 text-slate-100 rounded-md"
              >
                NO
              </button>
              <button
                onClick={handleVerifyDelete}
                className="px-4 py-2 font-bold bg-pink-700 text-slate-100 rounded-md"
              >
                YES
              </button>
            </div>
          </div>
        </div>
      </>

      <div className="upload_message fixed transition-all duration-200 -top-10 left-0 right-0 flex justify-center items-center">
        {uploadMessage && (
          success ? (
            <p className="inline-block bg-green-200 text-green-600 p-2 rounded-md">
              {uploadMessage}
            </p>
          ) : (
            <p className="inline-block bg-red-200 text-red-600 p-2 rounded-md">
              {uploadMessage}
            </p>
          )
        )}
      </div>

      <div className="max-w-lg mx-auto mt-10 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-pink-800 mb-4">Profile</h2>
        <div className="mb-4 text-center">
            {profile.profile_picture ? (
            <img
              src={profile.profile_picture}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover mx-auto border-2 border-pink-300"
            />
          ) : (
            <img
              src={profileIcon}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover mx-auto border-2 border-pink-300"
            />
          )}
        </div>

        {editMode && (
          <div className="mb-4 text-center">
            <label className="block mb-2 text-sm font-medium text-pink-600">
              Edit Profile Picture
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-900 border border-pink-300 rounded-lg cursor-pointer focus:outline-none focus:border-pink-500"
            />
          </div>
        )}

        <div className="text-pink-600 space-y-4 mb-6">
          {/* Fullname */}
          <div className="flex justify-between items-center border-b pb-2">
            <span>
              <strong>Fullname:</strong>{" "}
              {editMode ? (
                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname || ""}
                  onChange={handleInputChange}
                  className="border p-2 rounded border-pink-300"
                />
              ) : (
                profile.fullname
              )}
            </span>
          </div>

          {/* Username */}
          <div className="flex justify-between items-center border-b pb-2">
            <span>
              <strong>Username:</strong>{" "}
              {editMode ? (
                <input
                  type="text"
                  name="username"
                  value={formData.username || ""}
                  onChange={handleInputChange}
                  className="border p-2 rounded border-pink-300"
                />
              ) : (
                profile.username
              )}
            </span>
          </div>

          {/* Email */}
          <div className="flex justify-between items-center border-b pb-2">
            <span>
              <strong>Email:</strong>{" "}
              {editMode ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleInputChange}
                  className="border p-2 rounded border-pink-300"
                />
              ) : (
                profile.email
              )}
            </span>
          </div>

          {/* Birth Day */}
          <div className="flex justify-between items-center border-b pb-2">
            <span>
              <strong>Birth Day:</strong>{" "}
              {editMode ? (
                <input
                  type="date"
                  name="birth_day"
                  value={formData.birth_day || ""}
                  onChange={handleInputChange}
                  className="border p-2 rounded border-pink-300"
                />
              ) : (
                profile.birth_day
              )}
            </span>
          </div>

          {/* Join Date (Read Only) */}
          <div className="flex justify-between items-center border-b pb-2">
            <span>
              <strong>Join Date:</strong> {profile.join_date}
            </span>
          </div>
        </div>

        {editMode && (
          <form onSubmit={handleUpdateProfile} className="mt-6">
            <button
              type="submit"
              className="mt-4 bg-pink-500 text-white py-2 px-6 rounded-lg shadow hover:bg-pink-600 focus:outline-none focus:ring focus:ring-pink-300"
            >
              Update Profile
            </button>
          </form>
        )}
        <div className="button flex justify-between">
          <button
            onClick={() => setEditMode(!editMode)}
            className="mt-4 bg-pink-500 text-white py-2 px-6 rounded-lg shadow hover:bg-pink-600 focus:outline-none focus:ring focus:ring-pink-300"
          >
            {editMode ? "Cancel" : "Edit Profile"}
          </button>
          <button
            onClick={() => setConfirmDelete(!confirmDelete)}
            className="mt-4 bg-red-500 text-white py-2 px-6 rounded-lg shadow hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300"
          >
            Delete Account
          </button>
        </div>
      </div>
    </>
  );
};

export default Profile;

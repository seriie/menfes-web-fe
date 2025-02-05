import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { LoggedinCtx } from "../App";
import profileIcon from "../assets/image/profile_icon.png";

const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(LoggedinCtx);
  const [profile, setProfile] = useState({});
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const URL = `${import.meta.env.VITE_BACKEND_URL}profile/`;

  const handleFetchProfile = async () => {
    try {
      const response = await fetch(URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setProfile(data);

      if (response.status == 403) {
        setIsLoggedIn(false);
        localStorage.removeItem('token');
        alert(data.message);
      }
    } catch (e) {
      console.error("Error fetching profile:", e.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate('/login')
  };

  useEffect(() => {
    if (isLoggedIn) {
      handleFetchProfile();
    }
  }, [isLoggedIn, profile]);

  const path = ['/login', '/register'];

  const onClickRefresh = () => {
    location.reload();
  }

  return (
    <nav className={`bg-pink-500 p-4 text-white ${path.includes(location.pathname) ? 'absolute top-0 left-0 right-0' : ''}`}>
      <ul className="flex items-center justify-between">
        <li>
          <Link to="/" className="">
            <h1 onClick={() => setTimeout(() => {
              navigate(0)
            }, 100)} className="text-2xl font-bold text-pink-300">Menfes</h1>
          </Link>
        </li>
        {location.pathname === '/login' || location.pathname === '/register' ? (
          <>
          </>
        ) : (
          <>
            {isLoggedIn ? (
              <>
                {location.pathname === '/login' || location.pathname === '/register' ? navigate('/') : null}
                <li className="relative">
                  {profile.profile_picture ? (
                    <img
                      src={profile.profile_picture}
                      alt="Profile"
                      className="rounded-full w-8 h-8 object-cover cursor-pointer border-2 border-pink-300 hover:border-pink-100"
                      onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    />
                  ) : (
                    <img
                      src={profileIcon}
                      alt="Profile"
                      className="rounded-full w-8 h-8 object-cover cursor-pointer border-2 border-pink-300 hover:border-pink-100"
                      onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    />
                  )}
                  {isProfileMenuOpen && (
                    <div
                      className="absolute z-50 right-0 mt-2 bg-pink-600 border-2 border-pink-400 p-1 text-white rounded-md shadow-lg"
                      onMouseLeave={() => setIsProfileMenuOpen(false)}
                      onClick={onClickRefresh}
                    >
                      {[
                        { path: "/profile", label: "Profile" },
                        { path: "/inbox", label: "Inbox" },
                      ].map(
                        (item) =>
                          location.pathname !== item.path && (
                            <Link
                              key={item.path}
                              to={item.path}
                              className="block px-4 py-2 hover:bg-pink-400 rounded-sm"
                            >
                              {item.label}
                            </Link>
                          )
                      )}
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 hover:bg-pink-400 rounded-sm"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </li>
              </>
            ) : (
              <li>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-md bg-pink-700 hover:bg-pink-400"
                >
                  Sign in
                </Link>
              </li>
            )}
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
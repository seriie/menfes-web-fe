import { createContext, useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Auth/login/Login";
import Register from "./components/Auth/register/Register";
import ProfilePage from "./components/ProfilePage";
import PageNotFound from "./components/PageNotFound";
import Home from "./components/Home";
import CreateMenfes from "./components/CreateMenfes";
import Inbox from "./components/Inbox";
import Profiles from "./components/Profiles";
import axios from "axios";

const URL = import.meta.env.VITE_BACKEND_URL;
const API_KEY = import.meta.env.VITE_MENFES_API_KEY;

const LoggedinCtx = createContext();
const IsAdminCtx = createContext();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      fetchUrl();
    }
  }, []);

  const fetchUrl = async () => {
    try {
      const response = await axios.get(`${URL}profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setRole(response.data.role);
      setIsAdmin(response.data.role === "admin" || response.data.role === "owner");
    } catch (e) {
      console.error(e.response);
    }
  };

  return (
    <LoggedinCtx.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <IsAdminCtx.Provider value={{ isAdmin, setIsAdmin }}>
        <Router basename="/">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profiles/:username" element={<Profiles />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/create-menfes" element={<CreateMenfes />} />
            <Route path="/inbox" element={<Inbox />} />
            {/* <Route path="*" element={<PageNotFound />} /> */}
          </Routes>
        </Router>
      </IsAdminCtx.Provider>
    </LoggedinCtx.Provider>
  );
};

export { LoggedinCtx, IsAdminCtx };
export default App;
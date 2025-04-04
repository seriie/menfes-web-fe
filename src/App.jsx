import { createContext, useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Admin from "./components/admin/Admin";
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

const LoggedinCtx = createContext();
const IsAdminCtx = createContext();
const IsOwnerCtx = createContext();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const URL = import.meta.env.VITE_BACKEND_URL;
  const API_KEY = import.meta.env.VITE_MENFES_API_KEY;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      fetchUrl();
    }
    console.log(isAdmin);
  }, []);

  const fetchUrl = async () => {
    try {
      const response = await axios.get(`${URL}profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setRole(response.data.role);
      setIsAdmin(response.data.role === "admin");
      setIsOwner(response.data.role === "owner");
    } catch (e) {
      console.error(e.response);
    }
  };

  const insertVisitors = async () => {
    try {
      const response = await axios.post(`${URL}visitors`);
      console.log(response);
    } catch (e) {
      console.error("Error tracking visitors: ", e);
    }
  }

  useEffect(() => {
    insertVisitors();
  }, []);

  return (
    <LoggedinCtx.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <IsOwnerCtx.Provider value={{ isOwner, setIsOwner }}>
        <IsAdminCtx.Provider value={{ isAdmin, setIsAdmin }}>
          <Router basename="/">
            {location.pathname !== "/admin" && <Navbar />}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profiles/:username" element={<Profiles />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/create-menfes" element={<CreateMenfes />} />
              <Route path="/inbox" element={<Inbox />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Router>
        </IsAdminCtx.Provider>
      </IsOwnerCtx.Provider>
    </LoggedinCtx.Provider>
  );
};

export { LoggedinCtx, IsAdminCtx, IsOwnerCtx };
export default App;
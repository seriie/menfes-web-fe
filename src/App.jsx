import { createContext, useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Meta } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Auth/login/Login";
import Register from "./components/Auth/register/Register";
import ProfilePage from "./components/ProfilePage";
import PageNotFound from "./components/PageNotFound";
import Home from "./components/Home";
import CreateMenfes from "./components/CreateMenfes";
import Inbox from "./components/Inbox";
import axios from "axios";
const URL = import.meta.env.VITE_BACKEND_URL;

export const LoggedinCtx = createContext();
export const IsAdminCtx = createContext();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchUrl = async () => {
    try {
      const response = await axios.get(`${URL}profile`, {
        headers : {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });
      
      setRole(response.data.role);
      
    } catch (e) {
      console.error(e.response);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      fetchUrl();
    }
    role === 'admin' || role === 'owner' ? setIsAdmin(true) : setIsAdmin(false);
  }, [isAdmin, role]);

  const validPaths = ['/', '/login', '/register', '/profile', '/create-menfes', '/inbox'];

  return (
    <LoggedinCtx.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <IsAdminCtx.Provider value={{ isAdmin, setIsAdmin }}>
        <Router basename="/">
          {validPaths.includes(location.pathname) && <Navbar />}
          {!validPaths.includes(location.pathname) && <PageNotFound />}
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/create-menfes" element={<CreateMenfes />} />
            <Route path="/inbox" element={<Inbox />} />
          </Routes>
        </Router>
      </IsAdminCtx.Provider>
    </LoggedinCtx.Provider>
  );
};

export default App;
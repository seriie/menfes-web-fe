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

export const LoggedinCtx = createContext();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const validPaths = ['/', '/login', '/register', '/profile', '/create-menfes', '/inbox'];

  return (
    <LoggedinCtx.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <Router basename="/">
        {validPaths.includes(location.pathname) && <Navbar />}
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/create-menfes" element={<CreateMenfes />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </LoggedinCtx.Provider>
  );
};

export default App;

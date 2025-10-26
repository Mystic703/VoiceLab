import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import './Navbar.css';
import Logo from "../../assets/logo.svg";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setMenuOpen(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img className="logo" src={Logo} alt="Logo" />
        <ul>
          <li><a href="#overview">Overview</a></li>
          <li><a href="#features">Features</a></li>
        </ul>
      </div>

      <div className="navbar-right">
        {!user ? (
          <button onClick={() => navigate("/login")} className="sign-in-btn">Sign In</button>
        ) : (
          <div className="profile-container">
            <img
              src={user.photoURL || "https://via.placeholder.com/40"}
              alt="profile"
              className="profile-circle"
              onClick={() => setMenuOpen(!menuOpen)}
            />
            {menuOpen && (
              <div className="profile-menu">
                <p onClick={() => navigate("/profile")}>Profile</p>
                <p onClick={handleLogout}>Logout</p>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

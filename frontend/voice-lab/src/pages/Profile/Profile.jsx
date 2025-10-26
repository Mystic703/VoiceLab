import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate("/auth"); // redirect if not logged in
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/auth"); // redirect to login after logout
  };

  if (!user) return null; // render nothing while checking auth

  return (
    <div className="profile-page">
      <div className="profile-card">
        <img
          src={user.photoURL || "https://via.placeholder.com/100"}
          alt="profile"
        />
        <h2>{user.displayName || "N/A"}</h2>
        <p><strong>Email:</strong> {user.email}</p>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;

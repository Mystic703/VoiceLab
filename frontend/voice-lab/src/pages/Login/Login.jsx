import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import loginImage from "../../assets/loginImg.svg";
import logo from "../../assets/logo.svg";
import google from "../../assets/google.svg";
import "./Login.css";
import { auth, googleProvider, db } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 🔹 Redirect if user is already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/"); // change "/home" to your home route
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // 🔹 Handle Email/Password submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          createdAt: new Date(),
        });

        console.log("✅ Account created:", user.email);
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("✅ Logged in:", userCredential.user.email);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // 🔹 Google sign-in
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      await setDoc(doc(db, "users", user.uid), {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: new Date(),
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="main">
        <div className="login-left">
          <img src={loginImage} alt="Login Illustration" />
        </div>

        <div className="login-right">
          <div className="logo">
            <img src={logo} alt="Logo" />
            <h2>VoiceLab</h2>
            <p className="welcome-text">
              {isSignUp ? "Create your account" : "Nice to see you again"}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <p>Email</p>
              <input
                type="email"
                value={email}
                placeholder="Your Email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <p>Password</p>
              <input
                type="password"
                value={password}
                placeholder="Your Password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p style={{ color: "red", fontSize: "0.9rem" }}>{error}</p>}

            {!isSignUp && (
              <div className="links">
                <div className="remember">
                  <label className="switch">
                    <input type="checkbox" />
                    <span className="slider"></span>
                  </label>
                  <p>Remember Me</p>
                </div>
                <p style={{ cursor: "pointer" }}>Forgot Password ?</p>
              </div>
            )}

            <div className="buttons">
              <button type="submit" className="sign-in-btn">
                {isSignUp ? "Sign Up" : "Sign In"}
              </button>
              <hr />
              <div className="google" onClick={handleGoogleSignIn}>
                <img src={google} alt="Google" />
                <p>Or {isSignUp ? "sign up" : "sign in"} with Google</p>
              </div>
            </div>
          </form>

          <div className="sign-up">
            <p>
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <span onClick={() => setIsSignUp(!isSignUp)}>
                {isSignUp ? "Sign In" : "Sign Up!"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;

import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Importing icons for showing password

import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [errorMessage, setErrorMessage] = useState(""); // State to hold error message


  const { login } = useAuth();
  const onLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        login();
        navigate("/home");
      })
      .catch((error) => {
        // Handle errors and display error messages
        const errorCode = error.code;
        console.log("error-code:",error.code)
        if (errorCode === "auth/wrong-password") {
          setErrorMessage("Incorrect password. Please try again.");
        } else if (errorCode === "auth/user-not-found") {
          setErrorMessage("No account found with this email.");
        } else {
          setErrorMessage("Login failed. Please check your credentials.");
        }
        console.log(errorCode, error.message);
      });
  };

  return (
    <div className="login-container">
      <img src="/assets/logo-dark.svg" alt="" />

      <form className="login-form">
        <div className="email-container">
          <label htmlFor="email-address">Email address</label>
          <input
            id="email-address"
            name="email"
            type="email"
            required
            placeholder="Email address"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="password-container">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"} // Toggle password visibility
            required
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="password-toggle-icon"
            onClick={() => setShowPassword(!showPassword)} // Toggle showPassword state
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}{" "}
            {/* Eye icon for toggling */}
          </span>
        </div>
        {/* Display error message if exists */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <p className="text-sm text-white text-center">
          No account yet? <NavLink to="/signup">Sign up</NavLink>
        </p>
        <div>
          <button className="btn-primary-l" onClick={onLogin}>
            <h3>Login</h3>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;

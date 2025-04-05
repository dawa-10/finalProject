import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Styles/Login.css";

export default function LoginPage() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [postResponse, setPostResponse] = useState("");
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    setFormData((prevData) => ({ ...prevData, [e.target.name]: e.target.value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", formData);
      setPostResponse(response.data.message);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token); // Store the token in localStorage
        localStorage.setItem("username", formData.username); // Store username in localStorage
        navigate("/homepage"); // Redirect to protected page after successful login
      }
    } catch (error) {
      setPostResponse("Error logging in.");
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLoginSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleOnChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleOnChange}
          />
        </div>
        <div>
          <button type="submit">Login</button>
        </div>
      </form>
      Not a member yet? Click <a href="/create-user">here</a> to join
      {postResponse && <p>{postResponse}</p>}
    </div>
  );
}

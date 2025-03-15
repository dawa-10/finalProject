import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import "../Styles/Login.css"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [postResponse, setPostResponse] = useState("");
  const navigate = useNavigate(); // Initialize navigate for redirection

  const handleOnChange = (e) => {
    setFormData((prevData) => {
      return { ...prevData, [e.target.name]: e.target.value };
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post("http://localhost:3000/login", formData)
      .then((response) => {
        setPostResponse(response.data.message); // Show login response message
        if (response.data.token) {
          // Save the token (in localStorage or any state management)
          localStorage.setItem("token", response.data.token);

          // Redirect to the Recent Tournaments page
          navigate("/recent-tournaments");
        }
      })
      .catch((error) => {
        setPostResponse("Error logging in.");
      });
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

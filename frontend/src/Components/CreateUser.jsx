// CreateUser.js
import React, { useState } from "react";
import axios from "axios";

export default function CreateUser() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [postResponse, setPostResponse] = useState("");

  const handleOnChange = (e) => {
    setFormData((prevData) => {
      return { ...prevData, [e.target.name]: e.target.value };
    });
  };

  const handleCreateUserSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post("http://localhost:3000/create-user", formData)
      .then((response) => {
        setPostResponse("User Created"); // Set the response message
      })
      .catch((error) => {
        setPostResponse("Error creating user.");
      });
  };

  return (
    <div>
      <h1>Create User</h1>
      <form onSubmit={handleCreateUserSubmit}>
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
          <button type="submit">Create User</button>
          {postResponse && <p style={{ color: postResponse.includes("Error") ? "red" : "green" }}>{postResponse}</p>}
          Click <a href="/login">here</a> to go to login page
        </div>
      </form>
      

    </div>
  );
}

import React from "react";
import { useState } from "react";
import "./LoginForm.css";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  // email input field
  const [email, setEmail] = useState<string>("");
  //password input field
  const [password, setPassword] = useState<string>("");

  //access to navihgate hook
  const navigate = useNavigate();

  //when user clicks submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    //prevent default setting of page refresh
    e.preventDefault();

    // POST request for the login route with the email and password
    const response = await fetch("http://localhost:9000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    //parse the response from the server
    if (response.ok) {
      const data = await response.json();
      console.log("Login success:", data);

      //store token in local storage
      localStorage.setItem("token", data.token);

      //store user data in local storage
      localStorage.setItem("user", JSON.stringify(data.user));

      //redirect to the dashboard
      navigate("/profile");
    } else {
      //check if the login was no successful/check if the login was successful
      const errorData = await response.json();
      console.error("Login failed:", errorData.error || "Unknown error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form-container">
      <h2>Login</h2>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
        className="border rounded p-2"
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
        className="border rounded p-2"
      />

      <button type="submit"> Log In </button>
      {/* navigate user to register */}
      <p onClick={() => navigate("/register")}>
        Don't have an account? Register
      </p>
    </form>
  );
}

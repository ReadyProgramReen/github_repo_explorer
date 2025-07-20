import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterForm.css";

export default function RegisterForm() {
  //username, email and password state
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  //gives access to navigate function
  const navigate = useNavigate();

  //When user clicks handleSubmt button
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    //prevent default
    e.preventDefault();

    //fetch the registeration data
    try {
      const response = await fetch("http://localhost:9000/auth/register", {
        method: "POST",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, password }),
      });
      //parse through the response
      const data = await response.json();

      //Reset the email and password field
      setEmail("");
      setPassword("");
      setUsername("");

      //check if the response is not ok (a http built in property )
      if (!response.ok) {
        alert(data.error || "Registration failed");
        return;
      }

      //if the response is ok
      console.log("Registration successful", data);

      //navigate user to login page
      navigate("/login");

      //catch error
    } catch (error) {
      console.error("Error submitting form", error);
      alert("An error occured during registration.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="register-form-container" action="">
      <h2>Registration</h2>

      {/* //username input field */}
      <input
        type="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />

      {/* //email input field */}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      {/* //Password input field */}
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="password"
        required
      />

      {/* Submit button */}
      <button type="submit">Register</button>

      {/* navigate user to login */}
      <p onClick={() => navigate("/login")}>Already have an account? Login</p>
    </form>
  );
}

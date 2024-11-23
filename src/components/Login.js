import { useState, useRef } from "react";

export default function Login({ onClose, setLoggedIn, setUserID, setPassword, userID, password}) {
  
  const nameRef= useRef(null); // Ref for userID
  const passRef = useRef(null); // Ref for PW

  const handleLogin = async () => {
    try {
        const user = nameRef.current.value;
        const pw = passRef.current.value;
        setUserID(user);
        setPassword(pw);
        console.log({user,pw});

        const response = await fetch("http://localhost:3001/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify
          ({
            Cid: user,
            Cpass: pw})
        });
  
        if (!response.ok) {
          throw new Error("Login failed");
        }
  
        const data = await response.json();
        console.log("Login response:", data);
  
        // If Login Successful
        if (data.success) {
          console.log("Login successful!");
          setLoggedIn(true);
          onClose(); // Close the login popup
        } else {
          alert("Invalid userID or password");
        }
        //Login Unsuccessful
        } catch (error) {
          console.error("Error logging in:", error);
          alert("Wrong userID/ password. Please try again.");
        }
  };

  return (
    <div className="login-backdrop">
      <div className="login">
        <input type="number" ref={nameRef} placeholder="userID"/>
        <input type="text" ref={passRef} placeholder="Password"/>
        <div className="login-buttons">
          <button onClick={handleLogin}>Login</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

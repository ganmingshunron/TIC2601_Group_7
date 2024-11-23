import {useState} from 'react';
import { Link } from "react-router-dom"; 
import Login from './Login';

export default function Header() {
    const [userID, setUserID] = useState();
    const [password, setPassword] = useState("");
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [showLoginPopup, setShowLoginPopup] = useState(false); //Track popup logic

    const handleLogin = () => {
        setShowLoginPopup(false); //Make sure no Login Popup
        setLoggedIn(true);
    };

    const handleLogout = () => {
        setLoggedIn(false);
    };

    return (
        <div className="inline">
          <a href="/"><button>Home</button></a> {/* Refresh page */}
          <h1>Welcome to Shophee!</h1>

          {/* Cart only visible when logged in */}
          {isLoggedIn && (
            <Link to="/cart" state={{userID}}>
              <button>Cart</button>
            </Link>
          )}

          {/* Register only visible when logged out */}
          {!isLoggedIn && (
            <Link to="/Register">
              <button>Register</button>
            </Link>
          )}

          {/* Login/Logout */}
          {!isLoggedIn ? (
            <button onClick={() => setShowLoginPopup(true) }>Login</button>
            ) : (
            <button onClick={handleLogout}>Logout</button>
          )}

          {/* Login popup */}
          {showLoginPopup && (
            <Login
              onClose={() => setShowLoginPopup(false)}
              onLoginSuccess={handleLogin} 
              setLoggedIn={setLoggedIn}
              setUserID={setUserID}
              setPassword={setPassword}
              userID={userID}
              password={password}
            />
          )}
        </div>
    );
}
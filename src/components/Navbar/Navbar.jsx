import React from "react";
import { Link, useNavigate } from "react-router";
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import './Navbar.css'

const Navbar = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const handleSignOut = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        Cine<span>Log</span>
      </Link>
      <ul className="navbar-links">
        <li>
          <Link to="/movies">Browse Films</Link>
        </li>
        {user ? (
          <>
            <li className="navbar-welcome">Welcome Back {user.username}</li>
            <li>
              <button className="navbar-signout" onClick={handleSignOut}>
                Sign Out
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/sign-up" className="navbar-signup">
                Sign Up
              </Link>
            </li>
            <li>
              <Link to="/sign-in">Sign In</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;

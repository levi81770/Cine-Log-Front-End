// SignInForm.jsx
import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import { signIn } from "../../../services/authService";
import { UserContext } from "../../../contexts/UserContext";
import "../AuthForms.css";

const SignInForm = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (evt) => {
    setMessage("");
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const signedInUser = await signIn(formData);
      setUser(signedInUser);
      navigate("/");
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <main className="auth">
      <div className="auth__box">
        <p className="auth__eyebrow">Welcome Back</p>
        <h1 className="auth__title">Sign In</h1>
        <hr className="auth__rule" />

        {message && <p className="auth__error">{message}</p>}

        <form className="auth__form" autoComplete="off" onSubmit={handleSubmit}>
          <div className="auth__field">
            <label className="auth__label" htmlFor="username">
              Username
            </label>
            <input
              className="auth__input"
              type="text"
              autoComplete="off"
              id="username"
              value={formData.username}
              name="username"
              onChange={handleChange}
              required
            />
          </div>
          <div className="auth__field">
            <label className="auth__label" htmlFor="password">
              Password
            </label>
            <input
              className="auth__input"
              type="password"
              autoComplete="off"
              id="password"
              value={formData.password}
              name="password"
              onChange={handleChange}
              required
            />
          </div>
          <div className="auth__actions">
            <button className="auth__btn auth__btn--primary" type="submit">
              Sign In
            </button>
            <button
              className="auth__btn auth__btn--secondary"
              type="button"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
          </div>
        </form>

        <p className="auth__switch">
          Don't have an account?{" "}
          <span onClick={() => navigate("/sign-up")}>Sign Up</span>
        </p>
      </div>
    </main>
  );
};

export default SignInForm;

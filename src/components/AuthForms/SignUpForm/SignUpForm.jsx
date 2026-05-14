// SignUpForm.jsx
import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import { signUp } from "../../../services/authService";
import { UserContext } from "../../../contexts/UserContext";
import "../AuthForms.css";

const SignUpForm = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const { setUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    passwordConf: "",
  });

  const { username, password, passwordConf } = formData;

  const handleChange = (evt) => {
    setMessage("");
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const user = await signUp(formData);
      setUser(user);
      navigate("/");
    } catch (err) {
      setMessage(err.message);
    }
  };

  const isFormInvalid = () => {
    return !(username && password && password === passwordConf);
  };

  return (
    <main className="auth">
      <div className="auth__box">
        <p className="auth__eyebrow">Join CineLog</p>
        <h1 className="auth__title">Sign Up</h1>
        <hr className="auth__rule" />

        {message && <p className="auth__error">{message}</p>}

        <form className="auth__form" onSubmit={handleSubmit}>
          <div className="auth__field">
            <label className="auth__label" htmlFor="username">
              Username
            </label>
            <input
              className="auth__input"
              type="text"
              id="username"
              value={username}
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
              id="password"
              value={password}
              name="password"
              onChange={handleChange}
              required
            />
          </div>
          <div className="auth__field">
            <label className="auth__label" htmlFor="confirm">
              Confirm Password
            </label>
            <input
              className="auth__input"
              type="password"
              id="confirm"
              value={passwordConf}
              name="passwordConf"
              onChange={handleChange}
              required
            />
          </div>
          <div className="auth__actions">
            <button
              className="auth__btn auth__btn--primary"
              type="submit"
              disabled={isFormInvalid()}
            >
              Sign Up
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
          Already have an account?{" "}
          <span onClick={() => navigate("/sign-in")}>Sign In</span>
        </p>
      </div>
    </main>
  );
};

export default SignUpForm;

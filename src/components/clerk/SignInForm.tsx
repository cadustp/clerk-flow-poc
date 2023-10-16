import { useSignIn } from "@clerk/clerk-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/SignInForm.css"

export default function SignInForm() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [login, setLogin] = useState({
    email: "",
    password: ""
  });
  const [styles, setStyles] = useState({
    passInput: "",
    passLabel: "",
    wrongPass: false,
    emailInput: "",
    emailLabel: "",
    wrongEmail: false
  });
  const [submitCalls, setSubmitCalls] = useState(0);
  const navigate = useNavigate();
  const SIGN_UP_LINK = "http://localhost:3000/sign-up";

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setSubmitCalls((prev) => prev + 1);

    if (!isLoaded || submitCalls > 2) return;

    try {
      const result = await signIn.create({
        identifier: login.email,
        password: login.password
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        setSubmitCalls(0);
        navigate("/protected");
      } else {
        console.log(result);
      }
    } catch (error: any) {
      if (error.errors[0].message === "Couldn't find your account.") {
        const baseUrl = process.env.REACT_APP_BASE_URI_API;
        const endpoint = process.env.REACT_APP_USER_EMAIL_ENDPOINT;
        const response = await fetch(`${baseUrl}${endpoint}`, { method: 'post', body: JSON.stringify({ user: { email: login.email } }) });

        if (response.status === 200) handleSubmit(e);

        if (response.status === 404) {
          setStyles((prev) => ({ ...prev, passInput: "pass-error", passLabel: "error", wrongPass: true}));
        } else {
          console.log(response.body);          
        }
      }

      if (error.errors[0].message === "Password is incorrect. Try again, or use another method.") {
        setStyles((prev) => ({ ...prev, passInput: "input-error", passLabel: "error", wrongPass: true}));
      }

      if (error.errors[0].message === "Identifier is invalid.") {
        setStyles((prev) => ({ ...prev, emailInput: "input-error", emailLabel: "error", wrongEmail: true }));
      }
    }

  }

  return (
    <div className="rootBox">
      <form className="form">
        <div className="header">
          <h1 className="title">Sign in</h1>
          <p className="title-text">to continue to sdca-api-test</p>
        </div>
        
        <div className="input-box">
          <label htmlFor="email" className={`label ${styles.emailLabel}`}>Email</label>
        
          <input
            onChange={(e) => setLogin((prev) => ({ ...prev, email: e.target.value }))}
            id="email"
            name="email"
            type="email"
            className={`input ${styles.emailInput}`}
          />

          {
            styles.wrongEmail && (
              <span className="title-text wrong-pass-msg">Incorrect email!</span>
            )
          }
        </div>
        
        <div className="input-box">
          <label htmlFor="password" className={`label ${styles.passLabel}`}>Password</label>
        
          <input
            onChange={(e) => setLogin((prev) => ({ ...prev, password: e.target.value }))}
            id="password"
            name="password"
            type="password"
            className={`input ${styles.passInput}`}
          />

          {
            styles.wrongPass && (
              <span className="title-text wrong-pass-msg">Incorrect password!</span>
            )
          }
        </div>
        
        <button className="signin-btn" onClick={handleSubmit}>Continue</button>

        <div className="footer">
          <span className="footer-text">No account?</span>
          <a href={SIGN_UP_LINK} className="footer-link">Sign up</a>
        </div>
      </form>
    </div>
  );
}
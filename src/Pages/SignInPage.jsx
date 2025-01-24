import { useContext } from "react";
import { ApplicationContext } from "../App";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faApple,
  faGoogle,
  faMicrosoft,
} from "@fortawesome/free-brands-svg-icons";

export default function SignInPage() {
  const { Mode } = useContext(ApplicationContext);
  const ButtonStyle = {
    background: Mode ? "white" : "black",
    color: Mode ? "black" : "white",
  };
  const ElementStyle = {
    border: `1px solid ${Mode ? "white" : "black"}`,
    color: Mode ? "white" : "black",
  };
  const FormColor = {
    backgroundColor: Mode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
  };
  return (
    <>
      <div className="LoginContent">
        <form
          name="LoginForm"
          id="LoginForm"
          className="LoginForm"
          style={FormColor}
        >
          <h3 className="FormHeader">Login</h3>
          <label htmlFor="LoginEmail" className="FormLabel">
            Email:
          </label>
          <input
            type="email"
            id="LoginEmail"
            className="FormElement"
            style={ElementStyle}
            required
          />
          <label htmlFor="LoginPassword" className="FormLabel">
            Password:
          </label>
          <input
            type="password"
            id="LoginPassword"
            className="FormElement"
            style={ElementStyle}
            required
          />
          <button type="submit" className="FormLoginButton" style={ButtonStyle}>
            Log On
          </button>
          <div className="SignUpLink">
            Forgot Password ?{" "}
            <Link to="/signup" style={{ color: Mode ? "white" : "black" }}>
              Reset
            </Link>
          </div>
          <div className="SignUpLink">
            Need a NoteWeb Account ?{" "}
            <Link to="/signup" style={{ color: Mode ? "white" : "black" }}>
              Sign Up
            </Link>
          </div>
          <div className="FormSeperator">
            <div
              style={{
                margin: 0,
                padding: 0,
                border: "1px solid",
                width: "40%",
                marginRight: "5px",
              }}
            ></div>
            <div>Or</div>
            <div
              style={{
                margin: 0,
                padding: 0,
                border: "1px solid",
                width: "40%",
                marginLeft: "5px",
              }}
            ></div>
          </div>
          <div className="LoginSocial">
            <FontAwesomeIcon icon={faGoogle} className="LoginSocialIcon" />
            <FontAwesomeIcon icon={faApple} className="LoginSocialIcon" />
            <FontAwesomeIcon icon={faMicrosoft} className="LoginSocialIcon" />
          </div>
        </form>
      </div>
    </>
  );
}

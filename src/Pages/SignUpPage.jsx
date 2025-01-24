import { useContext } from "react";
import { ApplicationContext } from "../App";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faApple,
  faGoogle,
  faMicrosoft,
} from "@fortawesome/free-brands-svg-icons";

export default function SignUpPage() {
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
      <div className="SignUpContent">
        <form
          name="SignUpForm"
          id="SignUpForm"
          className="SignUpForm"
          style={FormColor}
        >
          <h3 className="FormHeader">Sign Up</h3>
          <label htmlFor="SignUpFirstName" className="FormLabel">
            First Name:
          </label>
          <input
            type="text"
            id="SignUpFirstName"
            className="FormElement"
            style={ElementStyle}
            required
          />
          <label htmlFor="SignUpLastName" className="FormLabel">
            Last Name:
          </label>
          <input
            type="text"
            id="SignUpLastName"
            className="FormElement"
            style={ElementStyle}
            required
          />
          <label htmlFor="SignUpEmail" className="FormLabel">
            Email:
          </label>
          <input
            type="email"
            id="SignUpEmail"
            className="FormElement"
            style={ElementStyle}
            required
          />
          <label htmlFor="SignUpPassword" className="FormLabel">
            Password:
          </label>
          <input
            type="password"
            id="SignUpPassword"
            className="FormElement"
            style={ElementStyle}
            required
          />
          <label htmlFor="SignUpConfirmPassword" className="FormLabel">
            Confirm Password:
          </label>
          <input
            type="password"
            id="SignUpConfirmPassword"
            className="FormElement"
            style={ElementStyle}
            required
          />
          <button
            type="submit"
            className="FormSignupButton"
            style={ButtonStyle}
          >
            Sign Up
          </button>
          <div className="LogInLink">
            Already have a NoteWeb Account ?{" "}
            <Link to="/login" style={{ color: Mode ? "white" : "black" }}>
              Log In
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
          <div className="SignUpSocial">
            <FontAwesomeIcon icon={faGoogle} className="SignUpSocialIcon" />
            <FontAwesomeIcon icon={faApple} className="SignUpSocialIcon" />
            <FontAwesomeIcon icon={faMicrosoft} className="SignUpSocialIcon" />
          </div>
        </form>
      </div>
    </>
  );
}

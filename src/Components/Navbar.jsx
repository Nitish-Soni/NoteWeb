import { useContext } from "react";
import { ApplicationContext } from "../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightToBracket,
  faToggleOff,
  faToggleOn,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { Mode, SetMode } = useContext(ApplicationContext);
  const navbarStyle = {
    backgroundColor: Mode ? "white" : "black",
    color: Mode ? "black" : "white",
  };

  const LinkButton = {
    color: Mode ? "black" : "white",
  };
  return (
    <>
      <div className="Navbar" style={navbarStyle}>
        <Link to="/" className="AppIcon" style={LinkButton}>
          NoteWeb
        </Link>
        <div className="NavbarButtons">
          <div className="AccountButton">
            <Link to="/login" className="LoginButton" style={LinkButton}>
              Login{" "}
              <FontAwesomeIcon
                icon={faRightToBracket}
                style={{ marginLeft: "5px" }}
              />
            </Link>
            <Link to="/signup" className="SignupButton">
              SignUp{" "}
              <FontAwesomeIcon icon={faUser} style={{ marginLeft: "5px" }} />
            </Link>
          </div>
          <div className="ToggleButton">
            {Mode ? (
              <button
                className="ModeButtonOn"
                onClick={() => {
                  SetMode(!Mode);
                }}
              >
                <FontAwesomeIcon icon={faToggleOn} />
              </button>
            ) : (
              <button
                className="ModeButtonOff"
                onClick={() => {
                  SetMode(!Mode);
                }}
              >
                <FontAwesomeIcon icon={faToggleOff} />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

import { useContext } from "react";
import { ApplicationContext } from "../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faRightToBracket,
  faToggleOff,
  faToggleOn,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import AvatarArray from "./UserAvatar";

export default function Navbar() {
  const {
    Mode,
    SetMode,
    LoggedIn,
    SetShowNotification,
    ShowNotification,
    SetShowAccountDetails,
    ShowAccountDetails,
  } = useContext(ApplicationContext);
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
          {LoggedIn ? (
            <div className="AccountButton">
              <button
                className="NotificationButton"
                style={LinkButton}
                onClick={() => {
                  SetShowNotification(!ShowNotification);
                  SetShowAccountDetails(false);
                }}
              >
                <FontAwesomeIcon icon={faBell} style={{ marginLeft: "5px" }} />
                <span className="NotificationDot" />
              </button>
              <button
                className="AccountDetailsButton"
                style={LinkButton}
                onClick={() => {
                  SetShowAccountDetails(!ShowAccountDetails);
                  SetShowNotification(false);
                }}
              >
                <img src={AvatarArray[0]} alt="alt" className="AccountAvatar" />
              </button>
            </div>
          ) : (
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
          )}
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

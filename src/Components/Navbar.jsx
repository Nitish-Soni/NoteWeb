import { useContext } from "react"; // Import the `useContext` hook to access global state
import { ApplicationContext } from "../App"; // Import the global context from App
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesomeIcon to use icons
import {
  faBell,
  faRightToBracket,
  faToggleOff,
  faToggleOn,
  faUser,
} from "@fortawesome/free-solid-svg-icons"; // Import icons from FontAwesome (for notifications, login, toggle buttons)
import { Link } from "react-router-dom"; // Import `Link` for navigation between pages
import AvatarArray from "./UserAvatar"; // Import Avatar array (user avatars)

export default function Navbar() {
  // Destructuring the context values (mode, logged in status, etc.) from ApplicationContext
  const {
    Mode, // Current theme (light or dark mode)
    SetMode, // Function to change the mode (toggle between light/dark mode)
    LoggedIn, // Boolean to check if the user is logged in
    SetShowNotification, // Function to toggle the visibility of notifications
    ShowNotification, // Boolean to control if the notification tab is visible
    SetShowAccountDetails, // Function to toggle the visibility of account details
    ShowAccountDetails, // Boolean to control if account details are visible
    UserData, // User data fetched from context (e.g., username, selected avatar)
  } = useContext(ApplicationContext);

  // Styles for the navbar based on the mode (light/dark)
  const navbarStyle = {
    backgroundColor: Mode ? "white" : "black", // White background for light mode, black for dark mode
    color: Mode ? "black" : "white", // Black text for light mode, white for dark mode
  };

  // Styles for the links (Login, SignUp, etc.) in the navbar
  const LinkButton = {
    color: Mode ? "black" : "white", // Link color changes based on the mode
  };

  return (
    <>
      <div className="Navbar" style={navbarStyle}>
        {/* Navbar brand or app name that links to the home page */}
        <Link to="/" className="AppIcon" style={LinkButton}>
          NoteWeb
        </Link>

        {/* Navbar buttons (Notification, Account details, Login/Signup, and Mode toggle) */}
        <div className="NavbarButtons">
          {LoggedIn ? (
            // Display these options if the user is logged in
            <div className="AccountButton">
              {/* Notification Button */}
              <button
                className="NotificationButton"
                style={LinkButton}
                onClick={() => {
                  // Toggle the notification tab visibility and close account details if open
                  SetShowNotification(!ShowNotification);
                  SetShowAccountDetails(false);
                }}
              >
                <FontAwesomeIcon icon={faBell} style={{ marginLeft: "5px" }} />
                <span className="NotificationDot" />
              </button>

              {/* Account details button (opens user profile or settings) */}
              <button
                className="AccountDetailsButton"
                style={LinkButton}
                onClick={() => {
                  // Toggle the account details visibility and close notifications if open
                  SetShowAccountDetails(!ShowAccountDetails);
                  SetShowNotification(false);
                }}
              >
                {/* User avatar */}
                <img
                  src={AvatarArray[UserData.SelectedAvatar]} // Avatar based on selected avatar index from `UserData`
                  alt="User Avatar"
                  className="AccountAvatar"
                />
              </button>
            </div>
          ) : (
            // Display these options if the user is not logged in
            <div className="AccountButton">
              {/* Login Button */}
              <Link to="/login" className="LoginButton" style={LinkButton}>
                Login{" "}
                <FontAwesomeIcon
                  icon={faRightToBracket}
                  style={{ marginLeft: "5px" }}
                />
              </Link>

              {/* SignUp Button */}
              <Link to="/signup" className="SignupButton" style={LinkButton}>
                SignUp{" "}
                <FontAwesomeIcon icon={faUser} style={{ marginLeft: "5px" }} />
              </Link>
            </div>
          )}

          {/* Theme Toggle Button */}
          <div className="ToggleButton">
            {Mode ? (
              // Show the "Dark Mode" toggle button if in light mode
              <button
                className="ModeButtonOn"
                onClick={() => {
                  SetMode(!Mode); // Toggle the mode between light and dark
                }}
              >
                <FontAwesomeIcon icon={faToggleOn} />
              </button>
            ) : (
              // Show the "Light Mode" toggle button if in dark mode
              <button
                className="ModeButtonOff"
                onClick={() => {
                  SetMode(!Mode); // Toggle the mode between light and dark
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

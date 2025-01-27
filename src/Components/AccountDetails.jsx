import {
  faClose,
  faGear,
  faL,
  faSignOut,
  faUser,
} from "@fortawesome/free-solid-svg-icons"; // Importing icons from FontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Importing the FontAwesomeIcon component
import { useContext } from "react"; // Hook to use context
import { ApplicationContext } from "../App"; // Importing the ApplicationContext to access app-wide state
import Cookies from "js-cookie"; // Library to manage cookies
import { get, ref, remove } from "firebase/database"; // Firebase functions to get and remove data
import { AppDatabase } from "../Database/Firebase"; // Importing Firebase database reference
import { Link } from "react-router-dom"; // Importing the Link component for navigation in React Router

export default function AccountDetails() {
  // Destructuring values from the ApplicationContext to access mode, and functions for login/logout state
  const { Mode, SetShowAccountDetails, SetLoggedIn } =
    useContext(ApplicationContext);

  // Styling for the account details panel, dynamically changing based on dark/light mode
  const PannelStyle = {
    color: Mode ? "black" : "white", // Sets text color based on mode
    background: Mode ? "white" : "black", // Sets background color based on mode
  };

  // Function to handle logging off the user
  async function handleLogOff() {
    // Retrieve user and auth token values from cookies
    let UserValue = Cookies.get("userReference");
    let CookieValue = Cookies.get("authToken");

    try {
      // Create a reference to the session token in Firebase
      const TokenRef = ref(
        AppDatabase,
        `/SessionTokens/${UserValue}/${CookieValue}` // Path in Firebase where session data is stored
      );

      // Fetch session data to check if it exists
      const snapshot = await get(TokenRef);

      // If session exists, proceed to remove it
      if (snapshot.exists()) {
        remove(TokenRef); // Remove session token from Firebase
        Cookies.remove("authToken"); // Remove auth token from cookies

        SetLoggedIn(false); // Update login state
        window.location.href = "/"; // Redirect to homepage after logout
      }

      // Close the account details tab after logging off
      SetShowAccountDetails(false);
    } catch (error) {
      console.log(error); // Log any error that occurs during the process
    }
  }

  return (
    <>
      {/* Main container for the account details tab */}
      <div className="AccountDetailsTab" style={PannelStyle}>
        {/* Close button to hide the account details tab */}
        <div className="CloseButton">
          <button
            className="CloseButton"
            onClick={() => {
              SetShowAccountDetails(false); // Close account details tab when clicked
            }}
            style={PannelStyle}
          >
            <FontAwesomeIcon icon={faClose} /> {/* FontAwesome close icon */}
          </button>
        </div>

        {/* List of account details actions */}
        <div className="AccountDetailsList">
          <ul className="AccountDetailsList">
            {/* Link to My Profile */}
            <Link
              to="/myprofile" // Navigate to /myprofile route when clicked
              className="AccountDetailsListItem"
              style={PannelStyle}
              onClick={() => {
                SetShowAccountDetails(false); // Close account details tab after navigating
              }}
            >
              <FontAwesomeIcon icon={faUser} /> My Profile
            </Link>

            {/* Settings option */}
            <li
              className="AccountDetailsListItem"
              onClick={() => {
                SetShowAccountDetails(false); // Close the account details tab on click
              }}
            >
              <FontAwesomeIcon icon={faGear} /> Settings
            </li>

            {/* Divider line */}
            <div
              style={{
                width: "100%",
                border: "1px solid",
                marginTop: "2px",
                marginBottom: "2px",
              }}
            ></div>

            {/* Log off option */}
            <li
              className="AccountDetailsListItem"
              onClick={() => {
                handleLogOff(); // Call the handleLogOff function to log the user out
              }}
            >
              <FontAwesomeIcon icon={faSignOut} /> Log Off
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

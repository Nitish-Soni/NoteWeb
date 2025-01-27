import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { createContext, useEffect, useState } from "react";
import "./App.css";
import SignInPage from "./Pages/SignInPage";
import SignUpPage from "./Pages/SignUpPage";
import Navbar from "./Components/Navbar";
import HomePage from "./Pages/HomePage";
import Footer from "./Components/Footer";
import NotificationTab from "./Components/NotificationTab";
import AccountDetails from "./Components/AccountDetails";
import Cookies from "js-cookie";
import { get, ref, set } from "firebase/database";
import { AppDatabase } from "./Database/Firebase";
import MyProfile from "./Pages/MyProfile";
import md5 from "md5";
import PageNotFound from "./Pages/PageNotFound";

// Context to manage global state across the application
export const ApplicationContext = createContext("");

function App() {
  const [Mode, SetMode] = useState(false); // Manages light/dark mode
  const [LoggedIn, SetLoggedIn] = useState(false); // Tracks user login status
  const [ShowNotification, SetShowNotification] = useState(false); // Tracks if notifications are shown
  const [ShowAccountDetails, SetShowAccountDetails] = useState(false); // Controls account details visibility
  const [Loading, SetLoading] = useState(true); // Controls loading state during session check
  const [UserData, SetUserData] = useState({}); // Stores user data once fetched

  // Dynamic styles based on light/dark mode
  const ContentStyle = {
    backgroundColor: Mode ? "black" : "white",
    color: Mode ? "white" : "black",
  };

  useEffect(() => {
    async function checkSession() {
      SetLoading(true); // Start loading while session is being checked
      const UserValue = Cookies.get("userReference"); // Retrieve user reference cookie
      const CookieValue = Cookies.get("authToken"); // Retrieve auth token cookie

      // If both cookies exist, proceed to check session validity
      if (CookieValue || UserValue) {
        try {
          const UserRef = ref(AppDatabase, `/SessionTokens/${UserValue}`); // Reference to session token in Firebase
          const snapshot = await get(UserRef); // Fetch session data

          const CurrentTime = Date.now(); // Get current timestamp

          // If session exists, validate the token expiry time
          if (snapshot.exists()) {
            const TokenRef = ref(
              AppDatabase,
              `/SessionTokens/${UserValue}/${CookieValue}`
            );
            const TokenSnapshot = await get(TokenRef); // Fetch token details
            if (CurrentTime > TokenSnapshot.val().ExpiryTime) {
              SetLoggedIn(false); // Session expired, log out user
              faWindows.location.href = "/login"; // Redirect to login page
            } else {
              const TokenExpiryTime = CurrentTime + 3 * 86400000; // Extend session expiry by 3 days
              await set(TokenRef, {
                SessionToken: CookieValue,
                CreateDate: CurrentTime,
                ExpiryTime: TokenExpiryTime, // Update expiry time
                SessionFor: TokenSnapshot.val().SessionFor, // Keep track of the session's user
              });

              // Retrieve user details based on session
              const UserDetailsRef = ref(
                AppDatabase,
                `/Users/${md5(TokenSnapshot.val().SessionFor)}`
              );
              const UserDataRef = await get(UserDetailsRef); // Fetch user data
              SetUserData(UserDataRef.val()); // Store user data in state
              SetLoggedIn(true); // Mark the user as logged in
            }
          } else {
            SetLoggedIn(false); // Session doesn't exist, user is not logged in
          }
        } catch (error) {
          console.error(error); // Log any errors
          SetLoggedIn(false); // Ensure the user is logged out if an error occurs
        }
      } else {
        SetLoggedIn(false); // No session data in cookies, user is not logged in
      }

      SetLoading(false); // End loading state once the session check is done
    }

    checkSession(); // Call the session check function
  }, []); // Run this effect only once, on initial render

  return (
    <>
      {/* If the app is still loading, show a loading spinner */}
      {Loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100%",
          }}
        >
          <div
            className="LoaderSpinner"
            style={{ width: "100px", height: "100px" }}
          ></div>
        </div>
      ) : (
        <Router>
          {/* Provide global state through ApplicationContext to all components */}
          <ApplicationContext.Provider
            value={{
              Mode,
              SetMode,
              LoggedIn,
              SetLoggedIn,
              SetShowNotification,
              ShowNotification,
              ShowAccountDetails,
              SetShowAccountDetails,
              UserData,
              SetUserData,
              SetLoading,
            }}
          >
            {/* Navbar and NotificationTab are displayed globally */}
            <Navbar />
            {ShowNotification && <NotificationTab />}
            {ShowAccountDetails && <AccountDetails />}

            {/* Main content area with dynamic styles based on the theme */}
            <div className="content" style={ContentStyle}>
              {/* Define application routes */}
              <Routes>
                <Route path="/" element={<HomePage />} /> {/* Home Page */}
                <Route
                  path="/login"
                  element={LoggedIn ? <Navigate to="/" /> : <SignInPage />} // Redirect logged-in users to home
                />
                <Route
                  path="/signup"
                  element={LoggedIn ? <Navigate to="/" /> : <SignUpPage />} // Redirect logged-in users to home
                />
                <Route
                  path="/myprofile"
                  element={LoggedIn ? <MyProfile /> : <Navigate to="/login" />} // Protect the route for logged-in users
                />
                <Route path="*" element={<PageNotFound />} />{" "}
                {/* 404 page for unknown routes */}
              </Routes>
            </div>

            {/* Footer is displayed globally */}
            <Footer />
          </ApplicationContext.Provider>
        </Router>
      )}
    </>
  );
}

export default App;

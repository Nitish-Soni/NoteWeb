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

export const ApplicationContext = createContext("");

function App() {
  const [Mode, SetMode] = useState(false);
  const [LoggedIn, SetLoggedIn] = useState(false);
  const [ShowNotification, SetShowNotification] = useState(false);
  const [ShowAccountDetails, SetShowAccountDetails] = useState(false);
  const [Loading, SetLoading] = useState(false);
  const [UserData, SetUserData] = useState({});

  const ContentStyle = {
    backgroundColor: Mode ? "black" : "white",
    color: Mode ? "white" : "black",
  };

  useEffect(() => {
    async function checkSession() {
      SetLoading(true);
      const CookieValue = Cookies.get("authToken");

      if (CookieValue) {
        try {
          const TokenRef = ref(AppDatabase, `/SessionTokens/${CookieValue}`);
          const snapshot = await get(TokenRef);
          const CurrentTime = Date.now();

          if (snapshot.exists()) {
            if (CurrentTime > snapshot.val().ExpiryTime) {
              SetLoggedIn(false);
              window.location.href = "/login"; // Redirecting to login if session expired
            } else {
              const TokenExpiryTime = CurrentTime + 3 * 86400000; // 3 days
              await set(TokenRef, {
                SessionToken: CookieValue,
                CreateDate: CurrentTime,
                ExpiryTime: TokenExpiryTime,
                SessionFor: snapshot.val().SessionFor,
              });

              const UserRef = ref(
                AppDatabase,
                `/Users/${md5(snapshot.val().SessionFor)}`
              );
              const UserDataRef = await get(UserRef);
              SetUserData(UserDataRef.val());
              SetLoggedIn(true);
            }
          } else {
            SetLoggedIn(false);
          }
        } catch (error) {
          console.error(error);
          SetLoggedIn(false);
        }
      } else {
        SetLoggedIn(false);
      }

      SetLoading(false);
    }

    checkSession();
  }, []); // Empty dependency array to run on component mount

  return (
    <>
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
              SetLoading
            }}
          >
            <Navbar />
            {ShowNotification && <NotificationTab />}
            {ShowAccountDetails && <AccountDetails />}
            <div className="content" style={ContentStyle}>
              <Routes>
                {/* Home Page (always available) */}
                <Route path="/" element={<HomePage />} />

                {/* Login page */}
                <Route
                  path="/login"
                  element={LoggedIn ? <Navigate to="/" /> : <SignInPage />}
                />

                {/* Sign Up page */}
                <Route
                  path="/signup"
                  element={LoggedIn ? <Navigate to="/" /> : <SignUpPage />}
                />

                {/* My Profile page */}
                <Route
                  path="/myprofile"
                  element={LoggedIn ? <MyProfile /> : <Navigate to="/login" />}
                />

                {/* Fallback route (for non-existing routes) */}
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </div>
            <Footer />
          </ApplicationContext.Provider>
        </Router>
      )}
    </>
  );
}

export default App;

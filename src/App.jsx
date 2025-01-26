import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
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

export const ApplicationContext = createContext("");

function App() {
  const [Mode, SetMode] = useState(false);
  const [LoggedIn, SetLoggedIn] = useState(false);
  const [ShowNotification, SetShowNotification] = useState(false);
  const [ShowAccountDetails, SetShowAccountDetails] = useState(false);
  const [Loading, SetLoading] = useState(false);

  const ContentStyle = {
    backgroundColor: Mode ? "black" : "white",
    color: Mode ? "white" : "black",
  };

  useEffect(() => {
    async function PageLoader() {
      SetLoading(true);
      let CookieValue = Cookies.get("authToken");
      if (CookieValue !== undefined || CookieValue === "") {
        try {
          const TokenRef = ref(AppDatabase, `/SessionTokens/${CookieValue}`);
          const snapshot = await get(TokenRef);
          let CurrentTime = Date.now();
          if (snapshot.exists()) {
            if (CurrentTime > snapshot.val().ExpiryTime) {
              SetLoading(false);
              SetLoggedIn(false);
              window.location.href = "/login";
            } else {
              let TokenExpiryTime = CurrentTime + 3 * 86400000;
              try {
                await set(TokenRef, {
                  SessionToken: CookieValue,
                  CreateDate: CurrentTime,
                  ExpiryTime: TokenExpiryTime,
                  SessionFor: snapshot.val().SessionFor,
                });
                SetLoading(false);
                SetLoggedIn(true);
              } catch (error) {
                console.log(error);
              }
            }
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        SetLoggedIn(false);
        SetLoading(false);
      }
    }
    PageLoader();
  }, []);

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
            }}
          >
            <Navbar />
            {ShowNotification ? <NotificationTab /> : null}
            {ShowAccountDetails ? <AccountDetails /> : null}
            <div className="content" style={ContentStyle}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                {LoggedIn ? null : (
                  <Route path="/login" element={<SignInPage />} />
                )}
                {LoggedIn ? null : (
                  <Route path="/signup" element={<SignUpPage />} />
                )}
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

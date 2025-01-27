import {
  faClose,
  faGear,
  faL,
  faSignOut,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import { ApplicationContext } from "../App";
import Cookies from "js-cookie";
import { get, ref, remove } from "firebase/database";
import { AppDatabase } from "../Database/Firebase";
import { Link } from "react-router-dom";

export default function AccountDetails() {
  const { Mode, SetShowAccountDetails, SetLoggedIn } =
    useContext(ApplicationContext);
  const PannelStyle = {
    color: Mode ? "black" : "white",
    background: Mode ? "white" : "black",
  };

  async function handleLogOff() {
    let UserValue = Cookies.get("userReference");
    let CookieValue = Cookies.get("authToken");
    try {
      const TokenRef = ref(
        AppDatabase,
        `/SessionTokens/${UserValue}/${CookieValue}`
      );
      const snapshot = await get(TokenRef);
      if (snapshot.exists()) {
        remove(TokenRef);
        Cookies.remove("authToken");
        SetLoggedIn(false);
        window.location.href = "/";
      }
      SetShowAccountDetails(false);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="AccountDetailsTab" style={PannelStyle}>
        <div className="CloseButton">
          <button
            className="CloseButton"
            onClick={() => {
              SetShowAccountDetails(false);
            }}
            style={PannelStyle}
          >
            <FontAwesomeIcon icon={faClose} />
          </button>
        </div>
        <div className="AccountDetailsList">
          <ul className="AccountDetailsList">
            <Link
              to="/myprofile"
              className="AccountDetailsListItem"
              style={PannelStyle}
              onClick={() => {
                SetShowAccountDetails(false);
              }}
            >
              <FontAwesomeIcon icon={faUser} /> My Profile
            </Link>
            <li
              className="AccountDetailsListItem"
              onClick={() => {
                SetShowAccountDetails(false);
              }}
            >
              <FontAwesomeIcon icon={faGear} /> Settings
            </li>
            <div
              style={{
                width: "100%",
                border: "1px solid",
                marginTop: "2px",
                marginBottom: "2px",
              }}
            ></div>
            <li
              className="AccountDetailsListItem"
              onClick={() => {
                handleLogOff();
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

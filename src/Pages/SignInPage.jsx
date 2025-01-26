import { useContext, useState } from "react";
import { ApplicationContext } from "../App";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faApple,
  faGoogle,
  faMicrosoft,
} from "@fortawesome/free-brands-svg-icons";
import { AppDatabase, get, ref, set, remove } from "../Database/Firebase";
import md5 from "md5";

export default function SignInPage() {
  const { Mode, SetLoggedIn } = useContext(ApplicationContext);
  const [EmailValue, SetEmailValue] = useState("");
  const [PasswordValue, SetPasswordValue] = useState("");
  const [Loader, SetLoader] = useState(false);
  const [Text, SetText] = useState("");

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
  const ResponseTextStyler = {
    color: Text === "Login Successful" ? "green" : "red",
    margin: 0,
    padding: 0,
  };

  async function FormSubmitHandler(event) {
    event.preventDefault();
    SetLoader(true);
    try {
      const hashedEmail = md5(EmailValue);
      const userRef = ref(AppDatabase, `/Users/${hashedEmail}`);
      const snapshot = await get(userRef);
      if (!snapshot.exists()) {
        SetText("User does not Exist");
        SetLoader(false);
        return;
      }
      const userData = snapshot.val();
      const storedPassword = userData.UserPassword;
      if (storedPassword !== md5(PasswordValue)) {
        SetText("Incorrect Credentials");
        SetLoader(false);
        return;
      }
      let CurrentTime = Date.now();
      let SessionToken = md5(EmailValue + CurrentTime);
      let TokenExpiryTime = CurrentTime + 3 * 86400000;
      try {
        const TokenRef = ref(AppDatabase, `/SessionTokens/${SessionToken}`);
        await set(TokenRef, {
          SessionToken: SessionToken,
          CreateDate: CurrentTime,
          ExpiryTime: TokenExpiryTime,
          SessionFor: EmailValue,
        });
        document.cookie = "authToken" + "=" + SessionToken + ";path=/";
        SetLoader(false);
        SetLoggedIn(true);
        SetEmailValue("");
        SetPasswordValue("");
        window.location.href = "/";
      } catch (error) {
        SetText("An error occurred: " + error.message);
        SetLoader(false);
      }
    } catch (error) {
      SetText("An error occurred: " + error.message);
      SetLoader(false);
    }
  }

  return (
    <>
      <div className="LoginContent">
        <form
          name="LoginForm"
          id="LoginForm"
          className="LoginForm"
          style={FormColor}
          onSubmit={(event) => {
            FormSubmitHandler(event);
          }}
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
            value={EmailValue}
            onChange={(event) => {
              let TempEmail = event.target.value;
              SetEmailValue(TempEmail);
            }}
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
            value={PasswordValue}
            onChange={(event) => {
              let TempPassword = event.target.value;
              SetPasswordValue(TempPassword);
            }}
            required
          />
          {Text ? <h5 style={ResponseTextStyler}>{Text}</h5> : null}
          <button type="submit" className="FormLoginButton" style={ButtonStyle}>
            {Loader ? <div className="LoaderSpinner"></div> : "Log On"}
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

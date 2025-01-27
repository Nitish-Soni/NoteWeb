import { useContext, useState } from "react";
import { ApplicationContext } from "../App"; // Access the global context for app state
import { Link } from "react-router-dom"; // For navigation between pages
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // For icons
import {
  faApple,
  faGoogle,
  faMicrosoft,
} from "@fortawesome/free-brands-svg-icons"; // Social login icons
import { AppDatabase, get, ref, set } from "../Database/Firebase"; // Firebase setup for accessing DB
import md5 from "md5"; // MD5 hashing for passwords and session tokens

export default function SignInPage() {
  // Retrieving application context and setting state values
  const { Mode, SetLoggedIn } = useContext(ApplicationContext);

  // Local state hooks for storing email, password, loader state, and response text
  const [EmailValue, SetEmailValue] = useState("");
  const [PasswordValue, SetPasswordValue] = useState("");
  const [Loader, SetLoader] = useState(false);
  const [Text, SetText] = useState("");

  // Styles for various elements based on light/dark mode
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

  // Function to handle form submission
  async function FormSubmitHandler(event) {
    event.preventDefault(); // Prevent the default form submission behavior
    SetLoader(true); // Show loader while processing the login request

    try {
      // Hash the email for secure storage and retrieval
      const hashedEmail = md5(EmailValue);
      const userRef = ref(AppDatabase, `/Users/${hashedEmail}`);

      // Fetch user data from the Firebase database
      const snapshot = await get(userRef);
      if (!snapshot.exists()) {
        SetText("User does not Exist"); // Inform user if email is not found
        SetLoader(false); // Stop loader
        return;
      }

      // If the user exists, retrieve their data
      const userData = snapshot.val();
      const storedPassword = userData.UserPassword;

      // Compare stored password with the entered password (both are hashed)
      if (storedPassword !== md5(PasswordValue)) {
        SetText("Incorrect Credentials"); // Password mismatch
        SetLoader(false);
        return;
      }

      // If credentials are correct, generate a session token
      let CurrentTime = Date.now();
      let SessionToken = md5(EmailValue + CurrentTime);
      let TokenExpiryTime = CurrentTime + 3 * 86400000; // Set token expiration (3 days)

      try {
        // Save the session token in Firebase under the SessionTokens node
        const TokenRef = ref(
          AppDatabase,
          `/SessionTokens/${md5(EmailValue)}/${SessionToken}`
        );
        await set(TokenRef, {
          SessionToken: SessionToken,
          CreateDate: CurrentTime,
          ExpiryTime: TokenExpiryTime,
          SessionFor: EmailValue,
        });

        // Set cookies for the session token and user reference
        document.cookie = "userReference" + "=" + md5(EmailValue) + ";path=/";
        document.cookie = "authToken" + "=" + SessionToken + ";path=/";

        // Update the logged-in state
        SetLoader(false); // Stop loader
        SetLoggedIn(true); // Mark the user as logged in
        SetEmailValue(""); // Clear the email field
        SetPasswordValue(""); // Clear the password field
        window.location.href = "/"; // Redirect to homepage after login
      } catch (error) {
        // Handle any errors that occur while saving session token
        SetText("An error occurred: " + error.message);
        SetLoader(false);
      }
    } catch (error) {
      // Handle any errors during user retrieval or token creation
      SetText("An error occurred: " + error.message);
      SetLoader(false);
    }
  }

  return (
    <>
      {/* Main form container */}
      <div className="LoginContent">
        {/* The login form */}
        <form
          name="LoginForm"
          id="LoginForm"
          className="LoginForm"
          style={FormColor}
          onSubmit={(event) => {
            FormSubmitHandler(event); // Call the form submit handler when the form is submitted
          }}
        >
          <h3 className="FormHeader">Login</h3>

          {/* Email input field */}
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
              SetEmailValue(TempEmail); // Update email value when the input changes
            }}
            required // Make this field required for form submission
          />

          {/* Password input field */}
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
              SetPasswordValue(TempPassword); // Update password value when the input changes
            }}
            required // Make this field required for form submission
          />

          {/* Display error or success message */}
          {Text ? <h5 style={ResponseTextStyler}>{Text}</h5> : null}

          {/* Login button with loader while submitting */}
          <button type="submit" className="FormLoginButton" style={ButtonStyle}>
            {Loader ? <div className="LoaderSpinner"></div> : "Log On"}
          </button>

          {/* Links to reset password or sign up for a new account */}
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

          {/* Separator for social login options */}
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

          {/* Social media login icons */}
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

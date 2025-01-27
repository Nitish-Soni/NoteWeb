import { useContext, useEffect, useState } from "react";
import { ApplicationContext } from "../App"; // Accessing the global context (Mode)
import { Link } from "react-router-dom"; // For navigation to the Login page
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // For icons
import {
  faApple,
  faGoogle,
  faMicrosoft,
} from "@fortawesome/free-brands-svg-icons"; // Social login icons
import zxcvbn from "zxcvbn"; // Password strength checker
import { AppDatabase, get, ref, set } from "../Database/Firebase"; // Firebase for database interaction
import md5 from "md5"; // MD5 hashing for password and user email
import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons"; // Avatar selection icons
import AvatarArray from "../Components/UserAvatar"; // Avatar images array

export default function SignUpPage() {
  // Local state hooks for user details and validation
  const [FirstName, SetFirstName] = useState("");
  const [LastName, SetLastName] = useState("");
  const [EmailValue, SetEmailValue] = useState("");
  const [PasswordValue, SetPasswordValue] = useState("");
  const [ConfirmPasswordValue, SetConfirmPasswordValue] = useState("");
  const [PasswordStrength, SetPasswordStrength] = useState("");
  const [PasswordMatch, SetPasswordMatch] = useState(false);
  const [Loader, SetLoader] = useState(false);
  const [Text, SetText] = useState("");
  const [SelectedAvatar, SetSelectedAvatar] = useState(0); // Avatar selection

  // Context value for mode (light or dark)
  const { Mode } = useContext(ApplicationContext);

  // Styling for dark/light mode
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
  const PasswordStrengthStyler = {
    width:
      PasswordStrength === 0
        ? "25%"
        : PasswordStrength === 1
        ? "50%"
        : PasswordStrength === 2
        ? "75%"
        : PasswordStrength === 3
        ? "100%"
        : PasswordStrength === 4
        ? "100%"
        : "0%",
    background:
      PasswordStrength === 0
        ? "red"
        : PasswordStrength === 1
        ? "orange"
        : PasswordStrength === 2
        ? "yellow"
        : PasswordStrength === 3
        ? "green"
        : PasswordStrength === 4
        ? "green"
        : "transparent",
  };
  const ResponseTextStyler = {
    color: Text === "User already Exists" ? "red" : "green",
    margin: 0,
    padding: 0,
  };

  // Effect hook for password validation on input changes
  useEffect(() => {
    function PasswordStrengthValidation() {
      let result = zxcvbn(PasswordValue);
      SetPasswordStrength(result.score);
    }
    function PasswordConfirmPasswordMatchValidation() {
      if (PasswordValue === "") {
        SetPasswordMatch(false);
      } else if (ConfirmPasswordValue === "") {
        SetPasswordMatch(false);
      } else if (PasswordValue === ConfirmPasswordValue) {
        SetPasswordMatch(true);
      } else {
        SetPasswordMatch(false);
      }
    }
    PasswordStrengthValidation();
    PasswordConfirmPasswordMatchValidation();
  }, [PasswordValue, ConfirmPasswordValue]);

  // Function to handle form submission
  const FormSubmitHandler = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    SetLoader(true); // Show loader while processing

    try {
      const userRef = ref(AppDatabase, `/Users/${md5(EmailValue)}`);
      const snapshot = await get(userRef); // Check if the user already exists

      if (snapshot.exists()) {
        SetText("User already Exists");
        SetLoader(false);
        // Reset form values
        SetFirstName("");
        SetLastName("");
        SetPasswordValue("");
        SetEmailValue("");
        SetConfirmPasswordValue("");
        return;
      }

      // If the user doesn't exist, store the new user data in Firebase
      await set(userRef, {
        FirstName: FirstName,
        LastName: LastName,
        UserEmail: EmailValue,
        UserName: md5(EmailValue),
        UserPassword: md5(PasswordValue), // Store hashed password
        SelectedAvatar: SelectedAvatar,
      });

      SetText("Account Added Successfully"); // Success message
      SetFirstName("");
      SetLastName("");
      SetPasswordValue("");
      SetEmailValue("");
      SetConfirmPasswordValue("");
      SetSelectedAvatar(0); // Reset avatar selection

      SetLoader(false); // Hide loader
    } catch (error) {
      SetText("An error occurred: " + error.message); // Error handling
      SetLoader(false);
    }
  };

  return (
    <>
      <div className="SignUpContent">
        <form
          name="SignUpForm"
          id="SignUpForm"
          className="SignUpForm"
          style={FormColor}
          onSubmit={(event) => {
            FormSubmitHandler(event);
          }}
        >
          <h3 className="FormHeader">Sign Up</h3>

          {/* Avatar selection section */}
          <div className="SignUpAvatarContainer">
            <button
              className="ImageChangerButton"
              type="button"
              onClick={() => {
                if (SelectedAvatar === 0) {
                  SetSelectedAvatar(8);
                } else {
                  SetSelectedAvatar(SelectedAvatar - 1);
                }
              }}
            >
              <FontAwesomeIcon icon={faCaretLeft} />
            </button>
            <img
              alt="..."
              className="SignUpProfileAvatar"
              src={AvatarArray[SelectedAvatar]}
            ></img>
            <button
              className="ImageChangerButton"
              type="button"
              onClick={() => {
                if (SelectedAvatar === 8) {
                  SetSelectedAvatar(0);
                } else {
                  SetSelectedAvatar(SelectedAvatar + 1);
                }
              }}
            >
              <FontAwesomeIcon icon={faCaretRight} />
            </button>
          </div>

          {/* Form fields */}
          <label htmlFor="SignUpFirstName" className="FormLabel">
            First Name:
          </label>
          <input
            type="text"
            id="SignUpFirstName"
            className="FormElement"
            style={ElementStyle}
            value={FirstName}
            onChange={(event) => SetFirstName(event.target.value)}
            required
          />

          <label htmlFor="SignUpLastName" className="FormLabel">
            Last Name:
          </label>
          <input
            type="text"
            id="SignUpLastName"
            className="FormElement"
            style={ElementStyle}
            value={LastName}
            onChange={(event) => SetLastName(event.target.value)}
            required
          />

          <label htmlFor="SignUpEmail" className="FormLabel">
            Email:
          </label>
          <input
            type="email"
            id="SignUpEmail"
            className="FormElement"
            style={ElementStyle}
            value={EmailValue}
            onChange={(event) => SetEmailValue(event.target.value)}
            required
          />

          <label htmlFor="SignUpPassword" className="FormLabel">
            Password:
          </label>
          <input
            type="password"
            id="SignUpPassword"
            className="FormElement"
            style={ElementStyle}
            value={PasswordValue}
            onChange={(event) => SetPasswordValue(event.target.value)}
            required
          />

          {/* Password strength display */}
          {PasswordValue ? (
            <div className="PasswordStrengthCheck">
              <div
                className="PasswordStrengthLevel"
                style={PasswordStrengthStyler}
              ></div>
            </div>
          ) : null}

          <label htmlFor="SignUpConfirmPassword" className="FormLabel">
            Confirm Password:
          </label>
          <input
            type="password"
            id="SignUpConfirmPassword"
            className="FormElement"
            style={ElementStyle}
            value={ConfirmPasswordValue}
            onChange={(event) => SetConfirmPasswordValue(event.target.value)}
            required
          />

          {/* Response text after submission */}
          {Text ? <h5 style={ResponseTextStyler}>{Text}</h5> : null}

          <button
            type="submit"
            className="FormSignupButton"
            disabled={!PasswordMatch} // Button disabled if passwords don't match
            style={ButtonStyle}
          >
            {Loader ? <div className="LoaderSpinner"></div> : "Sign Up"}
          </button>

          <div className="LogInLink">
            Already have a NoteWeb Account ?{" "}
            <Link to="/login" style={{ color: Mode ? "white" : "black" }}>
              Log In
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

          {/* Social login icons */}
          <div className="SignUpSocial">
            <FontAwesomeIcon icon={faGoogle} className="SignUpSocialIcon" />
            <FontAwesomeIcon icon={faApple} className="SignUpSocialIcon" />
            <FontAwesomeIcon icon={faMicrosoft} className="SignUpSocialIcon" />
          </div>
        </form>
      </div>
    </>
  );
}

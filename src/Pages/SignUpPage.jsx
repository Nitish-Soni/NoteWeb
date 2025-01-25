import { useContext, useEffect, useState } from "react";
import { ApplicationContext } from "../App";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faApple,
  faGoogle,
  faMicrosoft,
} from "@fortawesome/free-brands-svg-icons";
import zxcvbn from "zxcvbn";
import { AppDatabase, get, ref, set } from "../Database/Firebase";
import md5 from "md5";
import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import AvatarArray from "../Components/UserAvatar";

export default function SignUpPage() {
  const [FirstName, SetFirstName] = useState("");
  const [LastName, SetLastName] = useState("");
  const [EmailValue, SetEmailValue] = useState("");
  const [PasswordValue, SetPasswordValue] = useState("");
  const [ConfirmPasswordValue, SetConfirmPasswordValue] = useState("");
  const [PasswordStrength, SetPasswordStrength] = useState("");
  const [PasswordMatch, SetPasswordMatch] = useState(false);
  const [Loader, SetLoader] = useState(false);
  const [Text, SetText] = useState("");

  const [SelectedAvatar, SetSelectedAvatar] = useState(0);

  const { Mode } = useContext(ApplicationContext);

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

  const FormSubmitHandler = async (event) => {
    event.preventDefault();
    SetLoader(true);

    try {
      const userRef = ref(AppDatabase, `/Users/${md5(EmailValue)}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        SetText("User already Exists");
        SetLoader(false);
        SetFirstName("");
        SetLastName("");
        SetPasswordValue("");
        SetEmailValue("");
        SetConfirmPasswordValue("");
        return;
      }
      await set(userRef, {
        FirstName: FirstName,
        LastName: LastName,
        UserEmail: EmailValue,
        UserName: md5(EmailValue),
        UserPassword: md5(PasswordValue),
        SelectedAvatar: SelectedAvatar,
      });

      SetText("Account Added Successfully");
      SetFirstName("");
      SetLastName("");
      SetPasswordValue("");
      SetEmailValue("");
      SetConfirmPasswordValue("");
      SetSelectedAvatar(0);

      SetLoader(false);
    } catch (error) {
      SetText("An error occurred: " + error.message);
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
          <label htmlFor="SignUpFirstName" className="FormLabel">
            First Name:
          </label>
          <input
            type="text"
            id="SignUpFirstName"
            className="FormElement"
            style={ElementStyle}
            value={FirstName}
            onChange={(event) => {
              let FirstName = event.target.value;
              SetFirstName(FirstName);
            }}
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
            onChange={(event) => {
              let LastName = event.target.value;
              SetLastName(LastName);
            }}
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
            onChange={(event) => {
              let TempEmail = event.target.value;
              SetEmailValue(TempEmail);
            }}
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
            onChange={(event) => {
              let TempPassword = event.target.value;
              SetPasswordValue(TempPassword);
            }}
            required
          />
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
            onChange={(event) => {
              let TempPassword = event.target.value;
              SetConfirmPasswordValue(TempPassword);
            }}
            required
          />
          {Text ? <h5 style={ResponseTextStyler}>{Text}</h5> : null}
          <button
            type="submit"
            className="FormSignupButton"
            disabled={!PasswordMatch}
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

// Importing necessary libraries and components
import { useContext, useEffect, useState } from "react";
import { ApplicationContext } from "../App"; // App context to manage global state
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // FontAwesome for icons
import {
  faCaretLeft,
  faCaretRight,
  faEdit,
  faFloppyDisk,
} from "@fortawesome/free-solid-svg-icons"; // Specific icons from FontAwesome
import AvatarArray from "../Components/UserAvatar"; // Array of avatar images
import zxcvbn from "zxcvbn"; // Password strength checker
import md5 from "md5"; // MD5 hashing for password comparison
import { get, ref, remove, set } from "firebase/database"; // Firebase functions
import { AppDatabase } from "../Database/Firebase"; // Firebase database reference

// Main Profile Component
export default function MyProfile() {
  // Extracting necessary state and context values
  const { UserData, Mode, SetUserData } = useContext(ApplicationContext);

  // Local state hooks for various form elements and actions
  const [SelectedAvatar, SetSelectedAvatar] = useState(UserData.SelectedAvatar);
  const [EditProfile, SetEditProfile] = useState(false);
  const [PasswordValue, SetPasswordValue] = useState(UserData.UserPassword);
  const [ConfirmPasswordValue, SetConfirmPasswordValue] = useState("");
  const [NewPasswordValue, SetNewPasswordValue] = useState("");
  const [PasswordStrength, SetPasswordStrength] = useState("");
  const [PasswordMatch, SetPasswordMatch] = useState(false);
  const [Text, SetText] = useState("");
  const [EditAvatar, SetEditAvatar] = useState(false);

  // Conditional button text based on profile editing state
  let ButtonValue = EditProfile ? "Save" : "Change Password";

  // Styling for various elements based on light/dark mode
  const ButtonStyle = {
    background: Mode ? "white" : "black",
    color: Mode ? "black" : "white",
    display: "flex",
    justifyContent: "center",
    alignItem: "center",
    margin: "3px",
  };
  const ResponseTextStyler = {
    color:
      Text === "Password Changed Successfully" || Text === "User Avatar Updated"
        ? "green"
        : "red",
    margin: "0",
    marginBottom: "10px",
    padding: 0,
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
  const AvatarButtonStyle = {
    color: Mode ? "white" : "black",
  };

  // useEffect hook to monitor changes in the new password and confirm password fields
  useEffect(() => {
    // Validate password strength using zxcvbn
    function PasswordStrengthValidation() {
      let result = zxcvbn(NewPasswordValue);
      SetPasswordStrength(result.score);
    }

    // Check if the new password and confirm password match
    function PasswordConfirmPasswordMatchValidation() {
      if (NewPasswordValue === "") {
        SetPasswordMatch(false);
      } else if (ConfirmPasswordValue === "") {
        SetPasswordMatch(false);
      } else if (NewPasswordValue === ConfirmPasswordValue) {
        SetPasswordMatch(true);
      } else {
        SetPasswordMatch(false);
      }
    }

    PasswordStrengthValidation();
    PasswordConfirmPasswordMatchValidation();
  }, [NewPasswordValue, ConfirmPasswordValue]);

  // Handle form submission for profile updates
  async function FormSubmitHandler(event) {
    event.preventDefault(); // Prevent the default form submission
    if (ButtonValue === "Change Password") {
      SetPasswordValue(""); // Reset password fields for change
      SetConfirmPasswordValue("");
      SetNewPasswordValue("");
      SetEditProfile(true); // Enable password edit mode
    } else if (ButtonValue === "Save") {
      if (md5(PasswordValue) === UserData.UserPassword) {
        if (NewPasswordValue === ConfirmPasswordValue) {
          if (md5(NewPasswordValue) === UserData.UserPassword) {
            SetText("Password can't be same as Current Password");
            setTimeout(() => {
              SetText(""); // Clear error message after 800ms
            }, 800);
            return;
          }
          try {
            // Update user data in Firebase
            const userRef = ref(AppDatabase, `/Users/${UserData.UserName}`);
            await set(userRef, {
              FirstName: UserData.FirstName,
              LastName: UserData.LastName,
              UserEmail: UserData.UserEmail,
              UserName: UserData.UserName,
              UserPassword: md5(NewPasswordValue), // Store hashed new password
              SelectedAvatar: SelectedAvatar,
            });
            SetText("Password Changed Successfully");
            SetEditProfile(false); // Disable password edit mode
            SetUserData({
              ...UserData,
              UserPassword: md5(NewPasswordValue), // Update global user data
            });

            // Generate new session token and update session in Firebase
            const TokenRef = ref(
              AppDatabase,
              `/SessionTokens/${UserData.UserName}`
            );
            let CurrentTime = Date.now();
            let SessionToken = md5(UserData.UserEmail + CurrentTime);
            let TokenExpiryTime = CurrentTime + 3 * 86400000;
            const UpdatedSessionToken = {
              SessionToken: SessionToken,
              CreateDate: CurrentTime,
              ExpiryTime: TokenExpiryTime,
              SessionFor: UserData.UserEmail,
            };
            await remove(TokenRef);
            await set(
              ref(
                AppDatabase,
                `/SessionTokens/${UserData.UserName}/${SessionToken}`
              ),
              UpdatedSessionToken
            );

            // Set new cookies with session token
            document.cookie =
              "userReference" + "=" + md5(UserData.UserEmail) + ";path=/";
            document.cookie = "authToken" + "=" + SessionToken + ";path=/";

            setTimeout(() => {
              SetText(""); // Clear success message after 800ms
            }, 800);
            return;
          } catch (error) {
            SetText(error); // Handle error if update fails
            return;
          }
        } else {
          SetText("Password doesn't Match");
          setTimeout(() => {
            SetText(""); // Clear error message after 800ms
          }, 800);
          return;
        }
      } else if (md5(PasswordValue) !== UserData.UserPassword) {
        SetText("Incorrect Current Password");
        setTimeout(() => {
          SetText(""); // Clear error message after 800ms
        }, 800);
        return;
      }
    }
  }

  // Handle avatar change and save
  async function HandelAvatarSave() {
    const userRef = ref(AppDatabase, `/Users/${UserData.UserName}`);
    try {
      await set(userRef, {
        FirstName: UserData.FirstName,
        LastName: UserData.LastName,
        UserEmail: UserData.UserEmail,
        UserName: UserData.UserName,
        UserPassword: UserData.UserPassword,
        SelectedAvatar: SelectedAvatar, // Save the selected avatar
      });
      SetEditAvatar(false); // Exit avatar editing mode
      SetUserData({ ...UserData, SelectedAvatar: SelectedAvatar }); // Update global user data
      SetText("User Avatar Updated");
      setTimeout(() => {
        SetText(""); // Clear success message after 800ms
      }, 800);
    } catch (error) {
      SetText(error); // Handle error if avatar update fails
      setTimeout(() => {
        SetText(""); // Clear error message after 800ms
      }, 800);
    }
  }

  return (
    <>
      <div className="MyProfileContainer">
        {/* Profile form container */}
        <form
          className="MyProfileContent"
          style={FormColor}
          name="MyProfieForm"
          onSubmit={(event) => {
            FormSubmitHandler(event); // Handle form submit
          }}
        >
          <h3 className="FormHeader">My Profile</h3>
          <div className="SignUpAvatarContainer">
            {/* Avatar selection and change buttons */}
            {EditAvatar ? (
              <button
                className="ImageChangerButton"
                type="button"
                style={AvatarButtonStyle}
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
            ) : null}
            <img
              alt="User Avatar"
              className="SignUpProfileAvatar"
              src={AvatarArray[SelectedAvatar]} // Display selected avatar
            />
            {EditAvatar ? (
              <button
                className="AvatarButton"
                type="button"
                style={AvatarButtonStyle}
                onClick={() => {
                  HandelAvatarSave(); // Save avatar
                }}
              >
                <FontAwesomeIcon icon={faFloppyDisk} />
              </button>
            ) : (
              <button
                className="AvatarButton"
                type="button"
                style={AvatarButtonStyle}
                onClick={() => {
                  SetEditAvatar(true); // Enable avatar edit mode
                }}
              >
                <FontAwesomeIcon icon={faEdit} />
              </button>
            )}
            {EditAvatar ? (
              <button
                className="ImageChangerButton"
                type="button"
                style={AvatarButtonStyle}
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
            ) : null}
          </div>

          {/* Input fields for user profile */}
          <label htmlFor="MyProfileFirstName" className="MyProfileLabel">
            First Name:
          </label>
          <input
            className="MyProfileValue"
            id="MyProfileFirstName"
            type="text"
            value={UserData.FirstName}
            style={ElementStyle}
            readOnly
          />
          <label htmlFor="MyProfileLastName" className="MyProfileLabel">
            Last Name:
          </label>
          <input
            className="MyProfileValue"
            id="MyProfileLastName"
            type="text"
            value={UserData.LastName}
            style={ElementStyle}
            readOnly
          />
          <label htmlFor="MyProfileUserName" className="MyProfileLabel">
            User Name:
          </label>
          <input
            className="MyProfileValue"
            id="MyProfileUserName"
            type="email"
            value={UserData.UserEmail}
            style={ElementStyle}
            readOnly
          />
          <label htmlFor="MyProfilePassword" className="MyProfileLabel">
            {EditProfile ? "Current Password:" : "Password:"}
          </label>
          <input
            type="password"
            id="MyProfilePassword"
            className="MyProfileValue"
            style={ElementStyle}
            value={PasswordValue}
            onChange={(event) => {
              let TempPassword = event.target.value;
              SetPasswordValue(TempPassword);
            }}
            readOnly={EditProfile ? false : true} // Allow password editing if EditProfile is true
            required={EditProfile ? true : false}
          />
          {EditProfile ? (
            <div style={{ width: "100%", margin: "0", padding: "0" }}>
              <label htmlFor="MyProfileNewPassword" className="MyProfileLabel">
                New Password:
              </label>
              <input
                type="password"
                id="MyProfileNewPassword"
                className="MyProfileValue"
                style={ElementStyle}
                value={NewPasswordValue}
                onChange={(event) => {
                  let TempPassword = event.target.value;
                  SetNewPasswordValue(TempPassword);
                }}
                required
              />
              {NewPasswordValue ? (
                <div className="PasswordStrengthCheck">
                  <div
                    className="PasswordStrengthLevel"
                    style={PasswordStrengthStyler} // Visualize password strength
                  ></div>
                </div>
              ) : null}
              <label
                htmlFor="MyProfileConfirmPassword"
                className="MyProfileLabel"
              >
                Confirm Password:
              </label>
              <input
                type="password"
                id="MyProfileConfirmPassword"
                className="MyProfileValue"
                style={ElementStyle}
                value={ConfirmPasswordValue}
                onChange={(event) => {
                  let TempPassword = event.target.value;
                  SetConfirmPasswordValue(TempPassword);
                }}
                required
              />
            </div>
          ) : null}

          {/* Display response message if any */}
          {Text ? <h5 style={ResponseTextStyler}>{Text}</h5> : null}

          {/* Form submission buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            {EditProfile ? (
              <button
                type="button"
                className="FormSignupButton"
                style={ButtonStyle}
                onClick={() => {
                  SetEditProfile(false); // Cancel profile editing
                  SetPasswordValue(UserData.UserPassword); // Reset password values
                  SetSelectedAvatar(UserData.SelectedAvatar);
                }}
              >
                Cancel
              </button>
            ) : null}
            <button
              type="submit"
              className="FormSignupButton"
              style={ButtonStyle}
              value={ButtonValue}
              disabled={
                ButtonValue === "Save"
                  ? !PasswordMatch || PasswordValue === "" // Disable save button if password mismatch or empty
                  : false
              }
            >
              {EditProfile ? "Save" : "Change Password"}{" "}
              {/* Change button text */}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

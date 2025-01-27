import { useContext, useEffect, useState } from "react";
import { ApplicationContext } from "../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import AvatarArray from "../Components/UserAvatar";
import zxcvbn from "zxcvbn";
import md5 from "md5";
import { ref, set } from "firebase/database";
import { AppDatabase } from "../Database/Firebase";

export default function MyProfile() {
  const { UserData, Mode, SetUserData } = useContext(ApplicationContext);

  const [SelectedAvatar, SetSelectedAvatar] = useState(UserData.SelectedAvatar);
  const [EditProfile, SetEditProfile] = useState(false);
  const [PasswordValue, SetPasswordValue] = useState(UserData.UserPassword);
  const [ConfirmPasswordValue, SetConfirmPasswordValue] = useState("");
  const [NewPasswordValue, SetNewPasswordValue] = useState("");
  const [PasswordStrength, SetPasswordStrength] = useState("");
  const [PasswordMatch, SetPasswordMatch] = useState(false);
  const [Text, SetText] = useState("");

  let ButtonValue = EditProfile ? "Save" : "Change Password";

  const ButtonStyle = {
    background: Mode ? "white" : "black",
    color: Mode ? "black" : "white",
    display: "flex",
    justifyContent: "center",
    alignItem: "center",
    margin: "3px",
  };
  const ResponseTextStyler = {
    color: Text === "Password Changed Successfully" ? "green" : "red",
    margin: 0,
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

  useEffect(() => {
    function PasswordStrengthValidation() {
      let result = zxcvbn(NewPasswordValue);
      SetPasswordStrength(result.score);
    }
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

  async function FormSubmitHandler(event) {
    event.preventDefault();
    if (ButtonValue === "Change Password") {
      SetPasswordValue("");
      SetConfirmPasswordValue("");
      SetNewPasswordValue("");
      SetEditProfile(true);
    } else if (ButtonValue === "Save") {
      if (md5(PasswordValue) === UserData.UserPassword) {
        if (NewPasswordValue === ConfirmPasswordValue) {
          if (md5(NewPasswordValue) === UserData.UserPassword) {
            SetText("Password can't be same as Current Password");
            setTimeout(() => {
              SetText("");
            }, 800);
            return;
          }
          try {
            const userRef = ref(AppDatabase, `/Users/${UserData.UserName}`);
            await set(userRef, {
              FirstName: UserData.FirstName,
              LastName: UserData.LastName,
              UserEmail: UserData.UserEmail,
              UserName: UserData.UserName,
              UserPassword: md5(NewPasswordValue),
              SelectedAvatar: SelectedAvatar,
            });
            SetText("Password Changed Successfully");
            SetEditProfile(false);
            SetUserData({
              ...UserData,
              SelectedAvatar: SelectedAvatar,
              UserPassword: md5(NewPasswordValue),
            });
            setTimeout(() => {
              SetText("");
            }, 800);
            return;
          } catch (error) {
            SetText(error);
            return;
          }
        } else {
          SetText("Password doesn't Match");
          setTimeout(() => {
            SetText("");
          }, 800);
          return;
        }
      } else if (md5(PasswordValue) !== UserData.UserPassword) {
        SetText("Incorrect Current Password");
        setTimeout(() => {
          SetText("");
        }, 800);
        return;
      }
    }
  }

  return (
    <>
      <div className="MyProfileContainer">
        <form
          className="MyProfileContent"
          style={FormColor}
          name="MyProfieForm"
          onSubmit={(event) => {
            FormSubmitHandler(event);
          }}
        >
          <h3 className="FormHeader">My Profile</h3>
          <div className="SignUpAvatarContainer">
            <button
              className="ImageChangerButton"
              type="button"
              style={ButtonStyle}
              onClick={() => {
                if (SelectedAvatar === 0) {
                  SetSelectedAvatar(8);
                } else {
                  SetSelectedAvatar(SelectedAvatar - 1);
                }
              }}
              disabled={EditProfile ? false : true}
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
              style={ButtonStyle}
              onClick={() => {
                if (SelectedAvatar === 8) {
                  SetSelectedAvatar(0);
                } else {
                  SetSelectedAvatar(SelectedAvatar + 1);
                }
              }}
              disabled={EditProfile ? false : true}
            >
              <FontAwesomeIcon icon={faCaretRight} />
            </button>
          </div>
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
            readOnly={EditProfile ? false : true}
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
                    style={PasswordStrengthStyler}
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
          {Text ? <h5 style={ResponseTextStyler}>{Text}</h5> : null}
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
                  SetEditProfile(false);
                  SetPasswordValue(UserData.UserPassword);
                  SetSelectedAvatar(UserData.SelectedAvatar);
                }}
              >
                Cancle
              </button>
            ) : null}
            <button
              type="submit"
              className="FormSignupButton"
              style={ButtonStyle}
              value={ButtonValue}
              disabled={
                ButtonValue === "Save"
                  ? !PasswordMatch || PasswordValue === ""
                  : false
              }
            >
              {EditProfile ? "Save" : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

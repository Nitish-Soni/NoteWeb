import { useContext } from "react";
import { ApplicationContext } from "../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import {
  faGithub,
  faGoogle,
  faInstagram,
  faLinkedin,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  let Year = new Date().getFullYear();
  const { Mode } = useContext(ApplicationContext);
  const FooterStyle = {
    backgroundColor: Mode ? "white" : "black",
    color: Mode ? "black" : "white",
  };
  const SocilaLinkColor = {
    color: Mode ? "black" : "white",
  };

  return (
    <>
      <div className="Footer" style={FooterStyle}>
        <div className="FooterContent">
          <div className="FooterFirst">
            <p className="FooterDescription">
              Hi, I'm Nitish Soni, a passionate web developer creating
              beautiful, user-friendly websites. I specialize in front-end and
              back-end development, with a focus on clean code and performance.
            </p>
          </div>
          <div className="FooterSecond">
            <div className="FooterSocial">
              <a className="FooterSocialLink" href="https://www.linkedin.com/in/-nitish-soni-/" target="_blank" style={SocilaLinkColor}>
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
              <a className="FooterSocialLink" href="https://github.com/Nitish-Soni" target="_blank" style={SocilaLinkColor}>
                <FontAwesomeIcon icon={faGithub} />
              </a>
              <a className="FooterSocialLink" href="mailto:nitishsoni890@gmail.com" target="_blank" style={SocilaLinkColor}>
                <FontAwesomeIcon icon={faGoogle} />
              </a>
              <a className="FooterSocialLink" href="https://www.instagram.com/_2nitish6_/" target="_blank" style={SocilaLinkColor}>
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a className="FooterSocialLink" href="https://x.com/_2nitish6_" target="_blank" style={SocilaLinkColor}>
                <FontAwesomeIcon icon={faTwitter} />
              </a>
            </div>
          </div>
        </div>
        <div className="Copyright">
          &copy; {Year} Nitish Soni, All Rights Reserved.
        </div>
      </div>
    </>
  );
}

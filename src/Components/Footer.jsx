import { useContext } from "react"; // Hook to use context
import { ApplicationContext } from "../App"; // Access the global state from App context
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesome Icon component
import { faHome } from "@fortawesome/free-solid-svg-icons"; // Importing solid icons (not used in the footer but can be later)
import {
  faGithub,
  faGoogle,
  faInstagram,
  faLinkedin,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons"; // Importing brand icons for social media links

export default function Footer() {
  // Get current year dynamically
  let Year = new Date().getFullYear();

  // Get the current mode (light or dark) from ApplicationContext
  const { Mode } = useContext(ApplicationContext);

  // Dynamic styles based on the current mode (light or dark)
  const FooterStyle = {
    backgroundColor: Mode ? "white" : "black", // Background color changes based on mode
    color: Mode ? "black" : "white", // Text color changes based on mode
  };

  // Styles for social media links (icons)
  const SocilaLinkColor = {
    color: Mode ? "black" : "white", // Icon color changes based on mode
  };

  return (
    <>
      {/* Footer container with dynamic background and text color */}
      <div className="Footer" style={FooterStyle}>
        <div className="FooterContent">
          {/* First section of the footer: description of the person */}
          <div className="FooterFirst">
            <p className="FooterDescription">
              Hi, I'm Nitish Soni, a passionate web developer creating
              beautiful, user-friendly websites. I specialize in front-end and
              back-end development, with a focus on clean code and performance.
            </p>
          </div>

          {/* Second section of the footer: Social media links */}
          <div className="FooterSecond">
            <div className="FooterSocial">
              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/-nitish-soni-/"
                target="_blank" // Opens in a new tab
                style={SocilaLinkColor} // Apply the dynamic color style for icons
              >
                <FontAwesomeIcon
                  icon={faLinkedin}
                  className="FooterSocialLink" // Apply custom CSS for the icon
                />
              </a>

              {/* GitHub */}
              <a
                href="https://github.com/Nitish-Soni"
                target="_blank"
                style={SocilaLinkColor}
              >
                <FontAwesomeIcon icon={faGithub} className="FooterSocialLink" />
              </a>

              {/* Email (using Google icon) */}
              <a
                href="mailto:nitishsoni890@gmail.com"
                target="_blank"
                style={SocilaLinkColor}
              >
                <FontAwesomeIcon icon={faGoogle} className="FooterSocialLink" />
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/_2nitish6_/"
                target="_blank"
                style={SocilaLinkColor}
              >
                <FontAwesomeIcon
                  icon={faInstagram}
                  className="FooterSocialLink"
                />
              </a>

              {/* Twitter */}
              <a
                href="https://x.com/_2nitish6_"
                target="_blank"
                style={SocilaLinkColor}
              >
                <FontAwesomeIcon
                  icon={faTwitter}
                  className="FooterSocialLink"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Footer copyright */}
        <div className="Copyright">
          &copy; {Year} Nitish Soni, All Rights Reserved.
        </div>
      </div>
    </>
  );
}

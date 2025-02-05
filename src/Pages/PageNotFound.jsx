import { useContext } from "react";
import { ApplicationContext } from "../App";
import { Link } from "react-router-dom";

export default function PageNotFound() {
  const { Mode } = useContext(ApplicationContext);
  const ButtonStyle = {
    background: Mode ? "white" : "black",
    color: Mode ? "black" : "white",
  };
  return (
    <>
      <div className="PageNotFoundContent">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <h3
            style={{
              margin: "0",
              padding: "0",
              width: "100%",
              textAlign: "center",
              fontSize: "50px",
            }}
          >
            Error
          </h3>
          <h1
            style={{
              margin: "0",
              padding: "0",
              width: "100%",
              textAlign: "center",
              fontSize: "300px",
              letterSpacing: "50px",
            }}
          >
            404
          </h1>
          <h3
            style={{
              margin: "0",
              padding: "0",
              width: "100%",
              textAlign: "center",
              fontSize: "30px",
            }}
          >
            This page is outside of the Unviverse.
          </h3>
          <p
            style={{
              margin: "0",
              padding: "0",
              width: "100%",
              marginTop: "20px",
              textAlign: "center",
            }}
          >
            The page you are looking for doesn't exist or have been moved.
          </p>
          <p
            style={{
              margin: "0",
              padding: "0",
              width: "100%",
              textAlign: "center",
            }}
          >
            Try going back to our Home-Page
          </p>
          <Link
            to="/"
            style={{
              textDecoration: "none",
              margin: "0",
              padding: "2px",
              width: "10%",
              textAlign: "center",
              marginTop: "20px",
              fontSize: "25px",
              border: "none",
              background: `${Mode ? "white" : "black"}`,
              color: `${Mode ? "black" : "white"}`,
              borderRadius: "10px",
            }}
          >
            Home
          </Link>
        </div>
      </div>
    </>
  );
}

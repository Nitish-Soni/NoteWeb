import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { createContext, useState } from "react";
import "./App.css";
import SignInPage from "./Pages/SignInPage";
import SignUpPage from "./Pages/SignUpPage";
import Navbar from "./Components/Navbar";
import HomePage from "./Pages/HomePage";
export const ApplicationContext = createContext("");

function App() {
  const [Mode, SetMode] = useState(false);
  const ContentStyle = {
    backgroundColor: Mode ? "black" : "white",
    color: Mode ? "white" : "black",
  };
  return (
    <Router>
      <ApplicationContext.Provider value={{ Mode, SetMode }}>
        <Navbar />
        <div className="content" style={ContentStyle}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
          </Routes>
        </div>
      </ApplicationContext.Provider>
    </Router>
  );
}

export default App;

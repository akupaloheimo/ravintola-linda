import { Routes, Route, BrowserRouter, Link } from "react-router-dom";
import "./App.css";
import React from "react";
import Menu from "./screens/Menu";
import SplashScreen from "./screens/SplashScreen";
import BookingScreen from "./screens/BookingScreen";
import ContactScreen from "./screens/ContactScreen";

function App() {
  return (
    <div className="body">
      <BrowserRouter>
        <div className="navbar">
          <Link className="button" to="/">
            Home
          </Link>
          <Link className="button" to="/menu">
            Menu
          </Link>
          <Link className="button" to="/booking">
            Reserve
          </Link>
          <Link className="button" to="/contact">
            Contact
          </Link>
        </div>
        <div className="body">
          <Routes>
            <Route path="/" element={<SplashScreen />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/booking" element={<BookingScreen />} />
            <Route path="/contact" element={<ContactScreen />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;

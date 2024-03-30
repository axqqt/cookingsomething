/* eslint-disable no-unused-vars */
import { createContext, useState } from "react";
import { Link, BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./Components/HomePage/Home";
import Unknown from "./Components/Unknown/Unknown";
import Write from "./Components/Write/Write";
import Login from "./Components/Login/Login";
import Navigate from "./Components/Navbar/Navigate";
import AddImage from "./Components/Images/AddImage";
import Register from "./Components/Register/Register";
import Vids from "./Components/Vids/Vids";
import Pricing from "./Components/Pricing/Pricing";
import Stories from "./Components/Stories/Stories";
import Bot from "./Components/Bot/Bot";

// eslint-disable-next-line react-refresh/only-export-components
export const theBag = createContext();

function App() {
  const BASE = "http://localhost:8000";
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({ username: "", password: "" });
  const [status, setStatus] = useState("");
  const [logged, setLogged] = useState(true);

  const theItems = {
    loading,
    setLoading,
    user,
    setUser,
    status,
    setStatus,
    BASE,
    logged,
    setLogged,
  };

  return (
    <>
      <BrowserRouter>
        <theBag.Provider value={theItems}>
          {/* <Navigate /> */}
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/pricing" element={<Pricing />}></Route>
            <Route path="/bot" element={<Bot />}></Route>
            <Route path="/write" element={<Write />}></Route>
            <Route path="/stories" element={<Stories />}></Route>
            <Route path="/vids" element={<Vids />}></Route>
            <Route path="/addimg" element={<AddImage />}></Route>
            <Route path="*" element={<Unknown />}></Route>
          </Routes>
        </theBag.Provider>
      </BrowserRouter>
    </>
  );
}

export default App;

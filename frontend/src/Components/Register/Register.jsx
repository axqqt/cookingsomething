/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { Link } from "react-router-dom";
import { theBag } from "../../App";

const Register = () => {
  const {
    status,
    setStatus,
    loading,
    setLoading,
    setLogged,
    logged,
    setUser,
    BASE,
  } = useContext(theBag);

  const [data, setData] = useState({ username: "", password: "" });
  const usernameField = useRef();
  const passwordField = useRef();

  const endPoint = `${BASE}/Register`;
  const navigate = useNavigate();

  const LogUser = async (e) => {
    e.preventDefault();
    if (!logged) {
      try {
        setLoading(true);
        const response = await Axios.post(endPoint, data);
        if (response.status === 200) {
          const responseData = response.data;
          const { AccessToken, RefreshToken } = responseData;
          localStorage.setItem("accessToken", AccessToken);
          localStorage.setItem("refreshToken", RefreshToken);
          sessionStorage.setItem("user", data);
          setLogged(true);
          setUser(responseData);
          navigate("/");
        } else {
          setStatus("Invalid Credentials!");
        }
      } catch (err) {
        console.log(err.message);
        if (err.response && err.response.status === 403) {
          setStatus("Username is wrong!");
        } else if (err.response && err.response.status === 401) {
          setStatus("Password is wrong!");
        } else {
          setStatus(
            "An error occurred while logging in. Please try again later."
          );
        }
      } finally {
        setLoading(false);
      }
    } else {
      setStatus("User already logged in!");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    }
  };


  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  return !logged ? (
    <div style={{ justifyContent: "space-evenly",margin:"80px",textAlign:"center" }}>
      <h1>Register Page</h1>
      <p>Use Credentials veloxal for username and velo123 as password!</p>
      <form onSubmit={LogUser}>
        <input
          type="text"
          ref={usernameField}
          onChange={handleChange}
          placeholder="Enter Username"
          name="username"
          required
        />
        <input
          ref={passwordField}
          type="password"
          onChange={handleChange}
          placeholder="Enter password"
          name="password"
          required
          minLength={5}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Register"}
        </button>
        <br />
        <h1>{status}</h1>
      </form>
      <br />
      <Link to="/newuser">Not a user yet? Click Here 😊</Link>
      <br />
      <Link to="/forgotpass">Forgot your password? Click Here</Link>
    </div>
  ) : (
    <div>
      <h1>You are already logged in!</h1>
      <p>
        Click <Link to="/">Here</Link> to go back to the homepage!
      </p>
    </div>
  );
};

export default Register;

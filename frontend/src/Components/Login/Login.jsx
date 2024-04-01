/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { Link } from "react-router-dom";
import { theBag } from "../../App";
// import "../../input.css";

const Login = () => {
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

  const navigate = useNavigate();

  const LogUser = async (e) => {
    e.preventDefault();
    if (!logged) {
      try {
        setLoading(true);
        const logingRequest = Login(data);
        if (logingRequest === 200) {
          setStatus(`Welcome back ${data.username}!`);
          setLogged(true);
        } else if (logingRequest === 401) {
          setStatus("Username is wrong!");
        } else if (logingRequest === 403) {
          setStatus("Wrong Password!");
        } else {
          setStatus("Error!");
        }
      } catch (err) {
        console.log(err.message);
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
    <div
      className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]"
      style={{ textAlign: "center", margin: "80px" }}
    >
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <form onSubmit={LogUser} className="grid gap-4">
            <div className="grid gap-2">
              <h1 htmlFor="email">Username</h1>
              <input
                id="email"
                type="text"
                placeholder="m@example.com"
                onChange={handleChange}
                name="username"
                ref={usernameField}
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <h1 htmlFor="password">Password</h1>
                <Link
                  to="/forgotpass"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                onChange={handleChange}
                ref={passwordField}
                name="password"
                required
              />
            </div>
            <button type="submit" className="w-full">
              Login
            </button>
            <button className="w-full">Login with Google</button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?
            <Link to="/newuser" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <img
          src="/placeholder.svg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  ) : <h1>You are already logged in!</h1>;
};

export default Login;

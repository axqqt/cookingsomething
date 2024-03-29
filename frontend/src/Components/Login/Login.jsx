/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { Link } from "react-router-dom";
import { theBag } from "../../App";
import "../../input.css";


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

  const endPoint = `${BASE}/login`;
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

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]" style={{textAlign:"center",margin:"60px"}}>
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
              <h1 htmlFor="email">Email</h1>
              <input
                id="email"
                type="email"
                placeholder="m@example.com"
                onChange={handleChange}
                name="username"
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
              <input id="password" type="password" onChange={handleChange} name="password" required />
            </div>
            <button type="submit" className="w-full">
              Login
            </button>
            <button  className="w-full">
              Login with Google
            </button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
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
  );
};

export default Login;

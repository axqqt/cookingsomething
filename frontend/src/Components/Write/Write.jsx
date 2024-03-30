/* eslint-disable no-unused-vars */
import { useContext, useState } from "react";
import { theBag } from "../../App";
import Axios from "axios";
import "./Write.css";
import { Link } from "react-router-dom";
import { CreateThumbnail } from "../Api/Api";
import CreateThumbnails from "./CreateThumbnail";

const Write = () => {
  const { loading, setLoading, status, setStatus, BASE } = useContext(theBag);
  const [userData, setData] = useState({
    theniche: "",
    write: "",
    productName: "",
  });
  const [prompt, setPrompt] = useState("");
  const [outcome, setOutcome] = useState({});
  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    setData({ ...userData, [e.target.name]: e.target.value });
  };

  async function createThumbnail(e) {
    e.preventDefault();
    if (status !== "") {
      setStatus("");
    }
    try {
      setLoading(true);
      const { data } = await Axios.post(`${BASE}/main/images`, prompt);
      if (data.status === 200) {
        setImages(data);
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setStatus(`Required fields not filled!`);
      } else if (err.response && err.response.status === 404) {
        setStatus(`No data found!`);
      } else {
        setStatus(`Error!`);
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function CopyWrite(e) {
    e.preventDefault();
    if (status !== "") {
      setStatus("");
    }
    try {
      setLoading(true);
      const response = await Axios.post(`${BASE}/main`, userData);

      if (response.status === 200) {
        setOutcome(response.data);
      }
    } catch (err) {
      if (err.response && err.status === 400) {
        setStatus(`Required fields not filled!`);
      } else if (err.response && err.status === 404) {
        setStatus(`No data found!`);
      } else {
        setStatus(`Error!`);
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="write-container">
      <h1
        className="write-heading"
        style={{ textAlign: "center", margin: "40px" }}
      >
        Copy Write!
      </h1>
      <form onSubmit={CopyWrite} className="write-form">
        <select
          className="write-input"
          name="theniche"
          required
          onChange={handleChange}
        >
          <option value="" disabled selected>
            Select Niche
          </option>
          <option value="technology">Technology</option>
          <option value="fashion">Fashion</option>
          <option value="health">Health</option>
          <option value="food">Food</option>
          {/* Add more options as needed */}
        </select>
        <input
          className="write-input"
          name="write"
          type="text"
          placeholder="How do you want the script to be written!"
          required
          onChange={handleChange}
        />
        <input
          className="write-input"
          name="productName"
          type="text"
          placeholder="Enter Your Product Name!"
          required
          onChange={handleChange}
        />
        <button type="submit" disabled={loading} className="write-button">
          Create!
        </button>
      </form>
      <p>{images ? JSON.stringify(images) : null}</p>
      <CreateThumbnails
        images={images}
        createThumbnail={createThumbnail}
        setPrompt={setPrompt}
        loading={loading}
      />
      <Link to={"/"}>Go Home!</Link>
      <p className="write-outcome">{outcome.generatedText}</p>
      <h1 className="write-status">{status}</h1>
    </div>
  );
};

export default Write;

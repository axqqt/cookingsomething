/* eslint-disable no-unused-vars */
import Axios from "axios";
import { useContext, useState } from "react";
import { theBag } from "../../App";

const Vids = () => {
  const [searchVid, setSearchVid] = useState("");

  const { BASE, loading, setLoading, status, setStatus } = useContext(theBag);

  async function createVideo() {
    try {
      setLoading(true);
      const request = await Axios.post(`${BASE}/vids`, { theVideo: searchVid });
      if (request.status === 200) {
        setStatus("request complete!");
      } else if (request.status === 404) {
        alert("No data found!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{textAlign:"center",margin:"40px"}}>
      <h1>Create Videos</h1>
      <form onSubmit={createVideo}>
        <input
          onChange={(e) => {
            setSearchVid(e.target.value);
          }}
          placeholder="Enter Video to generate!"
        ></input>
        <button type="submit" disabled={loading}>
          Create Video!
        </button>
      </form>
    </div>
  );
};

export default Vids;

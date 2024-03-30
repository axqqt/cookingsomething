import Axios from "axios";
import { useContext, useState } from "react";
import { theBag } from "../../App";

const Stories = () => {
  const { BASE, loading, setLoading } = useContext(theBag);
  const [prompt, setPrompt] = useState("");

  async function GenerateStories() {
    try {
      setLoading(true);
      const request = await Axios.post(`${BASE}/vids`, { theVids:prompt });
      if (request.status === 200) {
        alert("Generating!");
      } else if (request.status === 404) {
        alert("error!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ textAlign: "center", margin: "60px" }}>
      <h1>Stories</h1>
      <form onSubmit={GenerateStories}>
        <input
          onChange={(e) => {
            setPrompt(e.target.value);
          }}
          placeholder="Enter Prompt"
          type="text"
        ></input>
        <button type="submit" disabled={loading}>Generate!</button>
      </form>
    </div>
  );
};

export default Stories;

import { useContext, useState } from "react";
import { theBag } from "../../App";
import { GeminiPrompt } from "../Api/Api";
import NotLoggedIn from "../Login/NotLoggedIn";
import ImageDetection from "./ImageDetection";

const Bot = () => {
  const { status, setStatus, loading, setLoading, logged } = useContext(theBag);

  const [prompt, setPrompt] = useState("");
  const [botResponse, setBotResponse] = useState([]);

  async function GeminiCall(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const outcome = await GeminiPrompt(prompt);
      setBotResponse(outcome);
      if (outcome.status === 200) {
        //
      } else if (outcome.status === 404) {
        setStatus("No results found!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handlePrompt = (e) => {
    setPrompt(e.target.value);
  };

  return logged ? (
    !loading ? (
      <div style={{ margin: "40px" }}>
        <h1>Gemini</h1>
        <form onSubmit={GeminiCall}>
          <span>
            <label>Generate Response upon prompt!</label>
          </span>
          <br/>
          <input
            onChange={handlePrompt}
            placeholder="Enter your prompt!"
            type="text"
          ></input>
          <button type="submit" disabled={loading}>
            Search!
          </button>
        </form>
        <ImageDetection/>
        <p>{prompt}</p>
        <p>{botResponse.Output}</p> {/**String for now! */}
        <p>{status}</p>
      </div>
    ) : (
      <h1>Loading... Please Wait!</h1>
    )
  ) : (
    <NotLoggedIn />
  );
};

export default Bot;

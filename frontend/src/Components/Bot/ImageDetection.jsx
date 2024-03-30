/* eslint-disable no-unused-vars */
import { useContext, useState } from "react";
import { theBag } from "../../App";
import { GeminiUpload } from "../Api/Api";
import NotLoggedIn from "../Login/NotLoggedIn";

const ImageDetection = () => {
  const { loading, setLoading, logged, status, setStatus } = useContext(theBag);
  const [image, setImage] = useState(null);
  const [botResponse, setBotResponse] = useState({});

  async function UploadImage(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const outcome = await GeminiUpload(image);
      if (outcome.status === 200) {
        setBotResponse(outcome);
      } else if (outcome.status === 404) {
        setStatus("No results found!");
      } else {
        setStatus("Ack! We ran into an Error!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return logged ? (
    <div style={{marginTop:"80px"}}>
      <h1>Image Detection</h1>
      {loading ? (
        "Loading..."
      ) : (
        <div>
          <form onSubmit={UploadImage}>
            <input
              type="file"
              onChange={(e) => {
                setImage(e.target.files[0]);
              }}
              required
            ></input>
            <button disabled={loading} type="submit">Submit!</button>
          </form>
        </div>
      )}
    </div>
  ) : (
    <NotLoggedIn />
  );
};

export default ImageDetection;

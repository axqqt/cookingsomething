/* eslint-disable no-unused-vars */
import { useContext, useState } from "react";
import Axios from "axios";
import { theBag } from "../../App";
import { AddImg } from "../Api/Api";

const AddImage = () => {
  const { BASE, status, setStatus, loading, setLoading } = useContext(theBag);

  const [image, setImage] = useState(null);

  async function AddImages() {

    try {
      setLoading(true);
      await AddImg(image);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Add Image</h1>
      <form onSubmit={AddImages}>
        <input
          type="file"
          onChange={(e) => {
            setImage[e.target.files[0]];
          }}
        ></input>
        <button type="submit" disabled={loading}>Submit!</button>
      </form>
      {loading && "Loading..."}
      <p>{status}</p>
    </div>
  );
};

export default AddImage;

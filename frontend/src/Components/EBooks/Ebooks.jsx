/* eslint-disable no-unused-vars */
import Axios from "axios";
import { useContext, useState } from "react";
import { theBag } from "../../App";

const Ebooks = () => {
  const { loading, setLoading, status, setStatus, BASE } = useContext(theBag);
  const [generatedBook, setGeneratedBook] = useState({});
  const [data, setData] = useState({ title: "", pages: 25 });

  let generatedBooks = 0;

  async function GenerateBook(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const request = await Axios.post(`${BASE}/books`, data);
      if (request.status === 200) {
        setGeneratedBook(request.data);
        generatedBooks++;
        CreateCover();
      } else if (request.status === 404) {
        setStatus("No results found!");
      } else {
        setStatus("Error!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function CreateCover() {
    try {
      setLoading(true);
      const request = await Axios.post(`${BASE}/books/cover`);
      if (request.status === 200) {
        setGeneratedBook(request.data);
        GatherData();
      } else if (request.status === 404) {
        setStatus("No results found!");
      } else {
        setStatus("Error!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function GatherData() {
    try {
      setLoading(true);
      const request = await Axios.post(`${BASE}/books/gather`);
      if (request.status === 200) {
        setGeneratedBook(request.data);
      } else if (request.status === 404) {
        setStatus("No results found!");
      } else {
        setStatus("Error!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ margin: "40px", padding: "40px", textAlign: "center" }}>
      <h1>EBooks</h1>
      <form onSubmit={GenerateBook} style={{ margin: "40px" }}>
        <input
          onChange={handleChange}
          name="title"
          type="text"
          placeholder="Enter Book!"
          required
        ></input>
        <input
          onChange={handleChange}
          name="pages"
          type="number"
          value={data.pages}
          placeholder="Enter Book!"
          required
        ></input>
        <button type="submit" disabled={loading}>
          Generate!
        </button>
      </form>
      <p>
        {generatedBooks !== 0
          ? generatedBook.generatedText
            ? generatedBook.generatedText
            : "No results found!"
          : "Generate your book today!"}
      </p>
      {loading && <h1>Loading...</h1>}
      <p>{status}</p>
    </div>
  );
};

export default Ebooks;

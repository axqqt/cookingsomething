/* eslint-disable react/prop-types */

const CreateThumbnails = ({ createThumbnail, setPrompt, loading }) => {
  return (
    <div style={{marginTop:"40px",paddingTop:"20px"}}>
      <form onSubmit={createThumbnail} >
        <input
          className="write-input"
          onChange={(e) => {
            setPrompt(e.target.value);
          }}
          type="text"
          placeholder="Enter thumbnail style"
        />
        <button type="submit" disabled={loading}>
          Create Thumbnail
        </button>
      </form>
      <h1>{loading && "Loading..."}</h1>
    </div>
  );
};

export default CreateThumbnails;

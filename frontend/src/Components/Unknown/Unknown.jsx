import { Link } from "react-router-dom";

const Unknown = () => {
  return (
    <div>
      <h1>You visited an Unknown Page! </h1>
      <Link to="/">Go Home!</Link>
    </div>
  );
};

export default Unknown;

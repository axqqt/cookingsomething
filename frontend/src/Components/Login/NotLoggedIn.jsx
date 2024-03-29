import { Link } from "react-router-dom";

const NotLoggedIn = () => {
  return (
    <div>
      <Link to={"/login"}>Please login to continue!</Link>
    </div>
  );
};

export default NotLoggedIn;

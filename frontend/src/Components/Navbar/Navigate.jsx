import { Link } from "react-router-dom";
import "./Nav.css";

const Navigate = () => {
  return (
    <div className="home">
      <nav>
        <div className="logo">Veloxal</div>
        <ul>
          <li>
            <a href="#">Features</a>
          </li>
          <li>
            <a href="#">Pricing</a>
          </li>
          <li>
            <a href="#">Resources</a>
          </li>
          <li>
            <Link to={"/login"}>Login</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navigate;

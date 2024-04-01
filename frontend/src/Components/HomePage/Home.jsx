/* eslint-disable react/jsx-no-undef */
import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <div className="Home">
      <header>
        <nav>
          <div className="logo">Veloxal</div>
          <ul>
            <li>
              <Link to={"/login"}>Login</Link>
            </li>
            <li>
              <Link to={"/register"}>Register</Link>
            </li>
            <li>
              <Link to={"/pricing"}>Pricing</Link>
            </li>
            <li>
              <Link to={"/stories"}>Create Ai Stories</Link>
            </li>
          </ul>
        </nav>

        <div className="hero">
          <h1>Powerful SaaS Solution for CopyWriters</h1>
          <p>Automate with our cutting-edge CopyWriters platform.</p>
          <Link to={"/write"} className="cta">
            Get Started for Free
          </Link>
        </div>
      </header>
      <main>
        <section className="features">
          <h2>Key Features</h2>
          <div className="feature-grid">
            <Link to={"/vids"}>Generate Vids!</Link>
          </div>
          <div className="feature-grid">
            <Link to={"/bot"}>Bot</Link>
          </div>
          <div className="feature-grid">
            <Link to={"/books"}>Generate Books</Link>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-content">
          <div className="company-info">
            <div className="logo">Your SaaS Product</div>
            <p>&copy; 2023 Your SaaS Product. All rights reserved.</p>
          </div>
          <div className="links">
            <h4>Links</h4>
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
                <a href="#">Contact</a>
              </li>
            </ul>
          </div>
          <div className="social">
            <h4>Follow Us</h4>
            <ul>
              <li>
                <a href="#">Twitter</a>
              </li>
              <li>
                <a href="#">Facebook</a>
              </li>
              <li>
                <a href="#">LinkedIn</a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

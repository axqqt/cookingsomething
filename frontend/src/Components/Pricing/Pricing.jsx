import { Link } from "react-router-dom";
import "./Pricing.css";

const Pricing = () => {
  const pricing = [
    {
      plan: "starter",
      price: 60,
      features: ["Fortnite", "Is", "Fire for real"],
      link: "https://www.google.com/",
    },
    {
      plan: "Mid",
      price: 100,
      features: ["Valorant", "Is", "Fire for real"],
      link: "https://www.google.com/",
    },
    {
      plan: "Pro",
      price: 140,
      features: [""],
      link: "https://www.google.com/",
    },
  ];

  return (
    <div style={{ margin: "40px", textAlign: "center" }}>
      <h1>Pricing</h1>
      <div className="card">
        <div className="sub-card">
          {pricing.map((x, index) => (
            <Link to={x.link} className="pricing-card" key={index} style={{color:"white"}}>
              <h1 >{x.plan.toUpperCase()}</h1>
              <h2>{x.price && `$${x.price}`}</h2>
              <p>
                {x.features.map((feature, index) => (
                  <ul key={index} style={{ margin: "40px" }}>
                    <li>{feature && feature}</li>
                  </ul>
                ))}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;

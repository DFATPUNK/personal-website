import React from "react";
import "../../styles/identityCard.css";

const IdentityCard: React.FC = () => {
  return (
    <div className="identity-card">
      <ul className="identity-info">
        <li><a href="mailto:jeremy@example.com">📧 jeremy@jeremybrunet.com</a></li>
        <li><a href="tel:+33612345678">📞 +33 6 65 17 63 23</a></li>
        <li><a href="https://www.linkedin.com/in/j%C3%A9r%C3%A9my-brunet-446007b4/" target="_blank" rel="noopener noreferrer">💼 LinkedIn</a></li>
        <li><a href="https://github.com/DFATPUNK/personal-website" target="_blank" rel="noopener noreferrer">🐙 GitHub</a></li>
      </ul>
    </div>
  );
};

export default IdentityCard;
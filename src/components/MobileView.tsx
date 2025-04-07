import { useState } from "react";
import "../styles/mobileView.css";
import folderIcon from "../assets/icons/folder.png";
import openFolderIcon from "../assets/icons/open_folder.png";
import emailIcon from "../assets/icons/email.png";
import codeIcon from "../assets/icons/source_code.png";
import mediumIcon from "../assets/icons/medium.png";
import maddynessIcon from "../assets/icons/maddyness.jpg";

export default function MobileView() {
    const [certsOpen, setCertsOpen] = useState(true);
    const [articlesOpen, setArticlesOpen] = useState(true);
  
    return (
      <div className="mobile-wrapper">
        <h1 className="mobile-title animate-glow">Jérémy Brunet</h1>
        <div className="tree">
  
          {/* CV */}
          <div className="tree-item">
            <a href="/certificates/CV%20J%C3%A9r%C3%A9my%20Brunet%20Mars%202025.pdf" target="_blank" rel="noopener noreferrer">📄 CV</a>
          </div>
  
          {/* Certificats */}
          <div className="tree-item">
            <div className="tree-button" onClick={() => setCertsOpen(!certsOpen)}>
                <img src={certsOpen ? openFolderIcon : folderIcon} className="start-menu-icon" alt="folder" />
                Certificats
            </div>
        </div>
          {certsOpen && (
            <div className="tree-subgroup">
              <div className="tree-subitem">
                <a href="/certificates/cs50.pdf" target="_blank">🎓 CS50</a>
              </div>
              <div className="tree-subitem">
                <a href="/certificates/zapier_certificate.pdf" target="_blank">🪄 Zapier</a>
              </div>
            </div>
          )}
  
          {/* Articles */}
          <div className="tree-item">
            <div className="tree-button" onClick={() => setArticlesOpen(!articlesOpen)}>
                <img src={articlesOpen ? openFolderIcon : folderIcon} className="start-menu-icon" alt="folder" />
                Articles
            </div>
          </div>
          {articlesOpen && (
            <div className="tree-subgroup">
              <div className="tree-subitem">
                <a href="https://medium.com/user-experience-design-1/how-to-hack-people-loyalty-with-care-f2ce9346c47c" target="_blank"><img src={mediumIcon} className="start-menu-icon" /> How to hack people loyalty with care?</a>
              </div>
              <div className="tree-subitem">
                <a href="https://medium.com/hackernoon/how-to-scrap-didier-deschamps-email-651891ebe1e4" target="_blank"><img src={mediumIcon} className="start-menu-icon" /> How to scrap Didier Deschamps email</a>
              </div>
              <div className="tree-subitem">
                <a href="https://medium.com/free-code-camp/and-the-award-for-the-best-mooc-goes-to-308604e5bf2a" target="_blank"><img src={mediumIcon} className="start-menu-icon" /> And the award for the best MOOC goes to…🥁</a>
              </div>
              <div className="tree-subitem">
                <a href="https://www.maddyness.com/2017/10/24/exclu-peter-chatbot-aide-devoirs-leve-400-000-euros/" target="_blank"><img src={maddynessIcon} className="start-menu-icon" /> Peter, le chatbot d’aide aux devoirs...</a>
              </div>
            </div>
          )}
  
          {/* Contact */}
          <div className="tree-item">
            <a href="mailto:jeremy@jeremybrunet.com"><img src={emailIcon} className="start-menu-icon" />Me contacter</a>
          </div>
  
          {/* Code source */}
          <div className="tree-item">
            <a href="https://github.com/DFATPUNK/personal-website" target="_blank"><img src={codeIcon} className="start-menu-icon" /> Code source</a>
          </div>
        </div>
      </div>
    );
}
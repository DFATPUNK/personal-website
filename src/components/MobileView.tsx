import { useState } from "react";
import "../styles/mobileView.css";
import folderIcon from "../assets/icons/folder.png";
import openFolderIcon from "../assets/icons/open_folder.png";
import emailIcon from "../assets/icons/email.png";
import mediumIcon from "../assets/icons/medium.png";
import maddynessIcon from "../assets/icons/maddyness.jpg";
import demoIcon from "../assets/icons/open_params.png";

export default function MobileView() {
    const [certsOpen, setCertsOpen] = useState(true);
    const [articlesOpen, setArticlesOpen] = useState(false);
  
    return (
      <div className="mobile-wrapper">
        <h1 className="mobile-title">Jérémy Brunet</h1>
        <div className="tree">

          {/* CV */}
          <div className="tree-item">
            <a href="/certificates/Resume_Jeremy_Brunet_202601.pdf" target="_blank" rel="noopener noreferrer">📄 CV</a>
          </div>

          {/* CV */}
          <div className="tree-item">
            <a href="https://demos.jeremybrunet.com" target="_blank" rel="noopener noreferrer"><img src={demoIcon} className="start-menu-icon" />Démos</a>
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
        </div>
      </div>
    );
}
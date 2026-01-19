import { useState } from "react";
import "../styles/mobileView.css";
import folderIcon from "../assets/icons/folder.png";
import openFolderIcon from "../assets/icons/open_folder.png";
import emailIcon from "../assets/icons/email.png";
import codeIcon from "../assets/icons/source_code.png";
import balatroIcon from "../assets/icons/balatro.png";
import reposIcon from "../assets/icons/all_repos.png";
import mediumIcon from "../assets/icons/medium.png";
import maddynessIcon from "../assets/icons/maddyness.jpg";
import desktopIcon from "../assets/icons/desktop.png";
import moonIcon from "../assets/icons/moon.png";
import openParams from "../assets/icons/open_params.png";
import closedParams from "../assets/icons/closed_params.png";
import ilyaIcon from "../assets/icons/ilya.png";
import wizardIcon from "../assets/icons/wizard.png"


type MobileViewProps = {
  isMobile: boolean;
  setIsMobile: (val: boolean) => void;
  isNightMode: boolean;
  toggleNightMode: () => void;
};

export default function MobileView({ isMobile, setIsMobile, isNightMode, toggleNightMode }: MobileViewProps) {
    const [certsOpen, setCertsOpen] = useState(true);
    const [articlesOpen, setArticlesOpen] = useState(true);
    const [githubOpen, setGithubOpen] = useState(true);
    const [parametersOpen, setParametersOpen] = useState(false);

    const isMobileDevice = () => {
      if (typeof navigator === "undefined") return false;
      return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    };    
  
    return (
      <div className={`mobile-wrapper ${isNightMode ? 'night' : 'day'}`}>
        <h1 className={`mobile-title ${isNightMode ? 'night' : 'day'}`}>Jérémy Brunet</h1>
        <div className="tree">

          {/* CV */}
          <div className={`tree-item ${isNightMode ? "night-mode" : ""}`}>
            <a href="/certificates/Resume_Jeremy_Brunet_202601.pdf" target="_blank" rel="noopener noreferrer">📄 CV</a>
          </div>

          {/* Certificats */}
          <div className="tree-item">
            <div className={`tree-button ${isNightMode ? "night-mode" : ""}`} onClick={() => setCertsOpen(!certsOpen)}>
                <img src={certsOpen ? openFolderIcon : folderIcon} className="start-menu-icon" alt="folder" />
                Certificats
            </div>
        </div>
          {certsOpen && (
            <div className="tree-subgroup">
              <div className={`tree-subitem ${isNightMode ? "night-mode" : ""}`}>
                <a href="/certificates/cs50.pdf" target="_blank">🎓 CS50</a>
              </div>
              <div className={`tree-subitem ${isNightMode ? "night-mode" : ""}`}>
                <a href="/certificates/zapier_certificate.pdf" target="_blank">🪄 Zapier</a>
              </div>
            </div>
          )}

          {/* Articles */}
          <div className={`tree-item ${isNightMode ? "night-mode" : ""}`}>
            <div className={`tree-button ${isNightMode ? "night-mode" : ""}`} onClick={() => setArticlesOpen(!articlesOpen)}>
                <img src={articlesOpen ? openFolderIcon : folderIcon} className="start-menu-icon" alt="folder" />
                Articles
            </div>
          </div>
          {articlesOpen && (
            <div className="tree-subgroup">
              <div className={`tree-subitem ${isNightMode ? "night-mode" : ""}`}>
                <a href="https://medium.com/user-experience-design-1/how-to-hack-people-loyalty-with-care-f2ce9346c47c" target="_blank"><img src={mediumIcon} className="start-menu-icon" /> How to hack people loyalty with care?</a>
              </div>
              <div className={`tree-subitem ${isNightMode ? "night-mode" : ""}`}>
                <a href="https://medium.com/hackernoon/how-to-scrap-didier-deschamps-email-651891ebe1e4" target="_blank"><img src={mediumIcon} className="start-menu-icon" /> How to scrap Didier Deschamps email</a>
              </div>
              <div className={`tree-subitem ${isNightMode ? "night-mode" : ""}`}>
                <a href="https://medium.com/free-code-camp/and-the-award-for-the-best-mooc-goes-to-308604e5bf2a" target="_blank"><img src={mediumIcon} className="start-menu-icon" /> And the award for the best MOOC goes to…🥁</a>
              </div>
              <div className={`tree-subitem ${isNightMode ? "night-mode" : ""}`}>
                <a href="https://www.maddyness.com/2017/10/24/exclu-peter-chatbot-aide-devoirs-leve-400-000-euros/" target="_blank"><img src={maddynessIcon} className="start-menu-icon" /> Peter, le chatbot d’aide aux devoirs...</a>
              </div>
            </div>
          )}

          {/* Github */}
          <div className="tree-subgroup">
            <div className={`tree-button ${isNightMode ? "night-mode" : ""}`} onClick={() => setGithubOpen(!githubOpen)}>
                <img src={githubOpen ? openFolderIcon : folderIcon} className="start-menu-icon" alt="folder" />
                Github
            </div>
          </div>
          {githubOpen && (
            <div className="tree-subgroup">
              <div className={`tree-subitem ${isNightMode ? "night-mode" : ""}`}>
                <a href="https://github.com/DFATPUNK/personal-website" target="_blank"><img src={codeIcon} className="start-menu-icon" /> Code source</a>
              </div>
              <div className={`tree-subitem ${isNightMode ? "night-mode" : ""}`}>
                <a href="https://github.com/DFATPUNK/ilya30u30" target="_blank"><img src={ilyaIcon} className="start-menu-icon" /> <i>[WIP]</i> Ilya30u30</a>
              </div>
              <div className={`tree-subitem ${isNightMode ? "night-mode" : ""}`}>
                <a href="https://github.com/DFATPUNK/balatro-card-generator" target="_blank"><img src={balatroIcon} className="start-menu-icon" /> Balatro card generator</a>
              </div>
              <div className={`tree-subitem ${isNightMode ? "night-mode" : ""}`}>
                <a href="https://github.com/DFATPUNK/oauth-wizard-mvp" target="_blank"><img src={wizardIcon} className="start-menu-icon" /> <i>[WIP]</i> OAuth Wizard</a>
              </div>
              <div className={`tree-subitem ${isNightMode ? "night-mode" : ""}`}>
                <a href="https://github.com/DFATPUNK/" target="_blank"><img src={reposIcon} className="start-menu-icon" /> All repos</a>
              </div>
            </div>
          )}

          {/* Contact */}
          <div className={`tree-item ${isNightMode ? "night-mode" : ""}`}>
            <a href="mailto:jeremy@jeremybrunet.com"><img src={emailIcon} className="start-menu-icon" />Me contacter</a>
          </div>

          {/* Paramètres */}
          <div className="tree-subgroup">
            <div className={`tree-button ${isNightMode ? "night-mode" : ""}`} onClick={() => setParametersOpen(!parametersOpen)}>
                <img src={parametersOpen ? openParams : closedParams} className="start-menu-icon" alt="folder" />
                Paramètres
            </div>
          </div>
          {!isMobileDevice() && parametersOpen && (
            <div className="tree-subgroup">
              <div className={`tree-subitem ${isNightMode ? "night-mode" : ""}`} onClick={() => setIsMobile(!isMobile)}>
                <a><img src={desktopIcon} className="start-menu-icon" /> Desktop Layout</a>
              </div>
              <div className={`tree-subitem ${isNightMode ? "night-mode" : ""}`} onClick={toggleNightMode}>
                <a>
                  <img src={moonIcon} className="start-menu-icon" alt="mode nuit" />
                  {isNightMode ? "Mode jour" : "Mode nuit"}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    );
}
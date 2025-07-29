import React, { useState, useEffect, useRef } from "react";
import AssetsWindow from "./windows/AssetsWindow";
import ArticlesWindow from "./windows/ArticlesWindow";
import IdentityCard from "./windows/IdentityCard";
import "../styles/taskBar.css";
import userIcon from "../assets/icons/user.png";
import folderIcon from "../assets/icons/folder.png";
import certificateIcon from "../assets/icons/certificate.png";
import mediumIcon from "../assets/icons/medium.png";
import maddynessIcon from "../assets/icons/maddyness.jpg";
import codeIcon from "../assets/icons/source_code.png";
import gearIcon from "../assets/icons/gear.png";
import treeIcon from "../assets/icons/tree.png";
import moonIcon from "../assets/icons/moon.png";
import balatroIcon from "../assets/icons/balatro.png";
import reposIcon from "../assets/icons/all_repos.png";

interface StartMenuProps {
  onOpenWindow: (props: {
    title: string;
    content: React.ReactNode;
    minimized: boolean;
    width?: number;
    height?: number;
  }) => void;
  onCloseMenu: () => void;
  isMobile: boolean;
  setIsMobile: (value: boolean) => void;
  isNightMode: boolean;
  setIsNightMode: (value: boolean) => void;
}

const StartMenu: React.FC<StartMenuProps> = ({ onOpenWindow, onCloseMenu, isMobile, setIsMobile, isNightMode, setIsNightMode }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
  const [activeParameters, setActiveParameters] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onCloseMenu();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="start-menu" ref={menuRef}>
      <ul className="start-menu-list">
        <li className="start-menu-item" onClick={() =>
          onOpenWindow({
            title: "Jérémy Brunet",
            content: <IdentityCard />,
            minimized: false,
            width: 360,
            height: 200,
          })
        }>
          <img src={userIcon} className="start-menu-icon" /> Jérémy Brunet
        </li>

        <li className="start-menu-item has-submenu" onMouseEnter={() => setActiveMenu("documents")} onMouseLeave={() => setActiveMenu(null)}>
          <img src={folderIcon} className="start-menu-icon" /> Documents
          {activeMenu === "documents" && (
            <ul className="submenu submenu-right">
              <li className="submenu-item has-submenu" onMouseEnter={() => setActiveSubMenu("assets")} onMouseLeave={() => setActiveSubMenu(null)} onClick={() => onOpenWindow({ title: "Assets", content: <AssetsWindow />, minimized: false, width: 400, height: 300 })}>
                <img src={folderIcon} className="start-menu-icon" /> Assets
                {activeSubMenu === "assets" && (
                  <ul className="submenu submenu-right">
                    <li className="submenu-item" onClick={() => onOpenWindow({ title: "CS50 Certificate", content: (<img src="/certificates/cs50.png" alt="CS50" style={{ width: "100%" }} />), minimized: false, width: 800, height: 600 })}>
                      <img src={certificateIcon} className="start-menu-icon" /> cs50.pdf
                    </li>
                    <li className="submenu-item" onClick={() => onOpenWindow({ title: "Zapier Certificate", content: (<img src="/certificates/zapier_certificate.png" alt="Zapier" style={{ width: "100%" }} />), minimized: false, width: 800, height: 600 })}>
                      <img src={certificateIcon} className="start-menu-icon" /> zapier_certificate.pdf
                    </li>
                  </ul>
                )}
              </li>
              <li className="submenu-item has-submenu" onMouseEnter={() => setActiveSubMenu("articles")} onMouseLeave={() => setActiveSubMenu(null)} onClick={() => onOpenWindow({ title: "Articles", content: <ArticlesWindow />, minimized: false, width: 500, height: 500 })}>
                <img src={folderIcon} className="start-menu-icon" /> Articles
                {activeSubMenu === "articles" && (
                  <ul className="submenu submenu-right">
                    <li className="submenu-item" onClick={() => window.open("https://medium.com/user-experience-design-1/how-to-hack-people-loyalty-with-care-f2ce9346c47c", "_blank")}>
                      <img src={mediumIcon} className="start-menu-icon" /> How to hack people loyalty with care?
                    </li>
                    <li className="submenu-item" onClick={() => window.open("https://medium.com/hackernoon/how-to-scrap-didier-deschamps-email-651891ebe1e4", "_blank")}>
                      <img src={mediumIcon} className="start-menu-icon" /> How to scrap Didier Deschamps email
                    </li>
                    <li className="submenu-item" onClick={() => window.open("https://medium.com/free-code-camp/and-the-award-for-the-best-mooc-goes-to-308604e5bf2a", "_blank")}>
                      <img src={mediumIcon} className="start-menu-icon" /> And the award for the best MOOC goes to…🥁
                    </li>
                    <li className="submenu-item" onClick={() => window.open("https://www.maddyness.com/2017/10/24/exclu-peter-chatbot-aide-devoirs-leve-400-000-euros/", "_blank")}>
                      <img src={maddynessIcon} className="start-menu-icon" /> Peter, le chatbot d’aide aux devoirs...
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          )}
        </li>

        {/* Github */}
        <li className="start-menu-item has-submenu" onMouseEnter={() => setActiveMenu("github")} onMouseLeave={() => setActiveMenu(null)}>
          <img src={folderIcon} className="start-menu-icon" /> Github
          {activeMenu === "github" && (
            <ul className="submenu submenu-right">
              <li className="submenu-item" onClick={() => window.open("https://github.com/DFATPUNK/personal-website", "_blank")}> <img src={codeIcon} className="start-menu-icon" /> Source Code</li>
              <li className="submenu-item" onClick={() => window.open("https://github.com/DFATPUNK/ilya30u30", "_blank")}> <img src={codeIcon} className="start-menu-icon" /> <i>[WIP]</i> Ilya30u30</li>
              <li className="submenu-item" onClick={() => window.open("https://github.com/DFATPUNK/balatro-card-generator", "_blank")}> <img src={balatroIcon} className="start-menu-icon" /> Balatro card generator</li>
              <li className="submenu-item" onClick={() => window.open("https://github.com/DFATPUNK/oauth-wizard-mvp", "_blank")}> <img src={codeIcon} className="start-menu-icon" /> <i>[WIP]</i> OAuth Wizard</li>
              <li className="submenu-item" onClick={() => window.open("https://github.com/DFATPUNK", "_blank")}> <img src={reposIcon} className="start-menu-icon" /> All repos</li>
            </ul>
          )}
        </li>

        {/* Paramètres */}
        <li className="start-menu-item has-submenu" onMouseEnter={() => setActiveParameters("parametres")} onMouseLeave={() => setActiveParameters(null)}>
          <img src={gearIcon} className="start-menu-icon" /> Paramètres
          {activeParameters === "parametres" && (
            <ul className="submenu submenu-right">
              <li className="submenu-item" onClick={() => setIsMobile(!isMobile)}>
                <img src={treeIcon} className="start-menu-icon" alt="Tree layout" /> Tree Layout
              </li>
              <li className="submenu-item" onClick={() => setIsNightMode(!isNightMode)}>
                <img src={moonIcon} className="start-menu-icon" alt="Mode nuit" />
                {isNightMode ? "Mode jour" : "Mode nuit"}
              </li>
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
};

export default StartMenu;
import React, { useState } from "react";
import AssetsWindow from "./windows/AssetsWindow";
import ArticlesWindow from "./windows/ArticlesWindow";
import IdentityCard from "./windows/IdentityCard";
import "../styles/taskBar.css";
import userIcon from "../assets/icons/user.png";
import folderIcon from "../assets/icons/folder.png";
import gearIcon from "../assets/icons/gear.png";
import certificateIcon from "../assets/icons/certificate.png";

interface StartMenuProps {
  onOpenWindow: (props: {
    title: string;
    content: React.ReactNode;
    minimized: boolean;
    width?: number;
    height?: number;
  }) => void;
}

const StartMenu: React.FC<StartMenuProps> = ({ onOpenWindow }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);

  return (
    <div className="start-menu">
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

        <li
          className="start-menu-item has-submenu"
          onMouseEnter={() => setActiveMenu("documents")}
          onMouseLeave={() => setActiveMenu(null)}
        >
          <img src={folderIcon} className="start-menu-icon" /> Documents
          {activeMenu === "documents" && (
            <ul className="submenu submenu-right">
              <li
                className="submenu-item has-submenu"
                onMouseEnter={() => setActiveSubMenu("assets")}
                onMouseLeave={() => setActiveSubMenu(null)}
                onClick={() => onOpenWindow({
                    title: "Assets",
                    content: <AssetsWindow />,
                    minimized: false,
                    width: 400,
                    height: 300
                })}
                >
                <img src={folderIcon} className="start-menu-icon" /> Assets
                {activeSubMenu === "assets" && (
                  <ul className="submenu submenu-right">
                    <li
                      className="submenu-item"
                      onClick={() =>
                        onOpenWindow({
                          title: "CS50 Certificate",
                          content: (
                            <img
                              src="/certificates/cs50.png"
                              alt="CS50"
                              style={{ width: "100%" }}
                            />
                          ),
                          minimized: false,
                          width: 800,
                          height: 600,
                        })
                      }
                    >
                      <img src={certificateIcon} className="start-menu-icon" /> cs50.pdf
                    </li>
                    <li
                      className="submenu-item"
                      onClick={() =>
                        onOpenWindow({
                          title: "Zapier Certificate",
                          content: (
                            <img
                              src="/certificates/zapier_certificate.png"
                              alt="Zapier"
                              style={{ width: "100%" }}
                            />
                          ),
                          minimized: false,
                          width: 800,
                          height: 600,
                        })
                      }
                    >
                      <img src={certificateIcon} className="start-menu-icon" /> zapier_certificate.pdf
                    </li>
                  </ul>
                )}
              </li>
              <li
                className="submenu-item has-submenu"
                onMouseEnter={() => setActiveSubMenu("articles")}
                onMouseLeave={() => setActiveSubMenu(null)}
                onClick={() => onOpenWindow({
                    title: "Articles",
                    content: <ArticlesWindow />,
                    minimized: false,
                    width: 500,
                    height: 500
                })}
                >
                <img src={folderIcon} className="start-menu-icon" /> Articles
                {activeSubMenu === "articles" && (
                  <ul className="submenu submenu-right">
                    <li
                      className="submenu-item"
                      onClick={() =>
                        onOpenWindow({
                          title: "Startup Peter",
                          content: <p>Article sur ma startup Peter</p>,
                          minimized: false,
                          width: 500,
                          height: 300,
                        })
                      }
                    >
                      Startup Peter
                    </li>
                    <li
                      className="submenu-item"
                      onClick={() =>
                        onOpenWindow({
                          title: "Medium #1",
                          content: <p>Article Medium #1</p>,
                          minimized: false,
                          width: 500,
                          height: 300,
                        })
                      }
                    >
                      Medium #1
                    </li>
                    <li
                      className="submenu-item"
                      onClick={() =>
                        onOpenWindow({
                          title: "Medium #2",
                          content: <p>Article Medium #2</p>,
                          minimized: false,
                          width: 500,
                          height: 300,
                        })
                      }
                    >
                      Medium #2
                    </li>
                    <li
                      className="submenu-item"
                      onClick={() =>
                        onOpenWindow({
                          title: "Medium #3",
                          content: <p>Article Medium #3</p>,
                          minimized: false,
                          width: 500,
                          height: 300,
                        })
                      }
                    >
                      Medium #3
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          )}
        </li>

        {/*<li className="start-menu-item" onClick={() =>
          onOpenWindow({
            title: "Preferences",
            content: <p>Préférences</p>,
            minimized: false,
            width: 400,
            height: 300,
          })
        }>
          <img src={gearIcon} className="start-menu-icon" /> Paramètres
        </li>*/}
      </ul>
    </div>
  );
};

export default StartMenu;
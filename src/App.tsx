import WindowManager, { useWindowManager } from "./components/WindowManager";
import DesktopIcon from "./components/DesktopIcon";
import iconCV from "./assets/icons/cv.png";
import folderIcon from "./assets/icons/folder.png"
import React, { useState } from "react";
import BootScreen from "./components/BootScreen";
import CVWindow from "./components/windows/CVWindow";
import AssetsWindow from "./components/windows/AssetsWindow";
import ArticlesWindow from "./components/windows/ArticlesWindow";
import articleIcon from "./assets/icons/projects.png";
import "./index.css"

function Desktop() {
  const { openWindow } = useWindowManager();

  React.useEffect(() => {
    openWindow({
      title: "Bienvenue",
      content: (
        <div className="p-4 space-y-2">
          <h3>Bienvenue sur mon site personnel 👋</h3>
          <p>Vous trouverez sur mon bureau : </p>
          <li>mon CV</li>
          <li>mes certificats dans 'Assets'</li>
          <li>mes essais et articles dans 'Articles'</li>
          <p>Le menu 'Démarrer' vous proposera de : </p>
          <li>modifier les paramètres du site & accéder au code source</li>
          <li>parcourir mes documents</li>
          <li>me contacter</li>
          <div className="signature">Jérémy Brunet</div>
        </div>
      ),
      minimized: false,
    });
  }, []);

  return (
    <div className="desktop">
      {/* Icône CV */}
      <div className="desktop-icons">
        <DesktopIcon
          icon={iconCV}
          label="CV"
          onDoubleClick={() =>
            openWindow({
              title: "CV",
              content: <CVWindow />,
              width: 700,
              height: 700,
              minimized: false,
            })  
          }
        />
        <DesktopIcon
          icon={folderIcon}
          label="Assets"
          onDoubleClick={() =>
            openWindow({
              title: "Assets",
              content: <AssetsWindow />,
              minimized: false,
              width: 400,
              height: 300,
            })
          }
        />
        <DesktopIcon
          icon={articleIcon}
          label="Articles"
          onDoubleClick={() =>
            openWindow({
              title: "Articles",
              content: <ArticlesWindow />,
              minimized: false,
              width: 650,
              height: 550,
            })
          }
        />
      </div>
    </div>
  );
}

function App() {
  const [booted, setBooted] = useState(false);

  if (!booted) {
    return <BootScreen onFinish={() => setBooted(true)} />;
  }

  return (
    <WindowManager>
      <Desktop />
    </WindowManager>
  );
}

export default App;
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

function Desktop() {
  const { openWindow } = useWindowManager();

  React.useEffect(() => {
    openWindow({
      title: "Bienvenue",
      content: (
        <div className="p-4 space-y-2">
          <p>Bienvenue sur mon site personnel 👋</p>
          <p>Ce site est en cours de transformation pour ressembler à un bureau rétro !</p>
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
          icon={folderIcon} // 📁 une icône de dossier, si tu en as une
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
          icon={articleIcon} // 📁 une icône de dossier, si tu en as une
          label="Articles"
          onDoubleClick={() =>
            openWindow({
              title: "Articles",
              content: <ArticlesWindow />,
              minimized: false,
              width: 400,
              height: 400,
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
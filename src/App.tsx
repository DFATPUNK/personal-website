import ExperienceCard from "./components/ExperienceCard";
import { workExperiences } from "./data/work";
import { projectsDone } from "./data/projects";
import WindowManager, { useWindowManager } from "./components/WindowManager";
import Footer from "./components/Footer";
import DownloadWindowLauncher from "./components/DownloadWindowLauncher";
import DesktopIcon from "./components/DesktopIcon";
import iconCV from "./assets/icons/cv.png";
import React, { useState } from "react";
import BootScreen from "./components/BootScreen";

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
              content: (
                <iframe
                  src="/CV_Jeremy_Brunet_Mars_2025.pdf"
                  width="100%"
                  height="100%"
                  style={{ border: "none" }}
                />
              ),
            })
          }
        />
      </div>

      {/* Taskbar */}
      <footer className="taskbar">
        <button className="taskbar-button">Démarrer</button>
        <div className="taskbar-spacer"></div>
        <div className="taskbar-clock">12:00</div>
      </footer>
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
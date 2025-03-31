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

  return (
    <div className="desktop">
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
      <div className="min-h-screen text-retroText text-sm leading-relaxed pb-24 relative z-10">
        <header className="text-center mb-12 px-4">
          <h1 className="text-3xl font-retro text-retroText mb-4">Jérémy Brunet</h1>
          <p className="text-base font-modern text-gray-700">
            Développeur low/no-code — full-stack & automatisation
          </p>
          <a
            href="/CV-Jeremy-Brunet.pdf"
            className="mt-4 inline-block bg-retroAccent text-white px-4 py-2 rounded border border-retroBorder hover:bg-retroAccentHover transition"
            download
          >
            Télécharger mon CV
          </a>
        </header>

        <main className="max-w-5xl mx-auto px-4 space-y-12">
          <section>
            <h2 className="text-xl font-retro mb-4 border-b-2 border-retroBorder pb-1">
              Expériences professionnelles
            </h2>
            {workExperiences.map((exp, idx) => (
              <ExperienceCard key={idx} {...exp} />
            ))}
          </section>

          <section>
            <h2 className="text-xl font-retro mb-4 border-b-2 border-retroBorder pb-1">
              Projets & Réalisations
            </h2>
            {projectsDone.map((project, idx) => (
              <ExperienceCard key={idx} {...project} />
            ))}
          </section>

          <DownloadWindowLauncher />
        </main>

        <Footer />
      </div>
    </WindowManager>
  );
}

export default App;
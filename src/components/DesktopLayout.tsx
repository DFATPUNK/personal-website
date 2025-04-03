import { useEffect } from "react";
import WindowManager, { useWindowManager } from "./WindowManager";
import { RetroWindow } from "./RetroWindow";
import DesktopIcon from "./DesktopIcon";

const DesktopLayout = () => {
  const WelcomeWindow = () => {
    const { openWindow } = useWindowManager();

    useEffect(() => {
      openWindow({
        title: "Bienvenue",
        content: (
          <div className="p-4">
            Bienvenue sur mon site perso 👋<br />
            Prenez votre temps pour explorer.
          </div>
        ),
      });
    }, []);

    return null;
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#c0c0c0]">
      <WindowManager>
        <WelcomeWindow />

        {/* Icône CV en haut à gauche */}
        <div className="absolute top-4 left-4 text-center">
          <DesktopIcon
            icon="/src/assets/icons/cv.png"
            label="CV"
            onDoubleClick={() => {
              const { openWindow } = useWindowManager();
              openWindow({
                title: "Mon CV",
                content: <div className="p-4">Téléchargement du CV ici</div>,
              });
            }}
          />
        </div>
      </WindowManager>
    </div>
  );
};

export default DesktopLayout;
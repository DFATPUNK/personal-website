import React, { useEffect, useState } from "react";
import "../styles/bootScreen.css";
import desktopIcon from "../assets/icons/desktop.png";

const BootScreen: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const steps = [
      "Initializing retro kernel...",
      "Loading assets...",
      "Starting GUI...",
      "Welcome, Jeremy 👋"
    ];

    if (step < steps.length) {
      const timer = setTimeout(() => setStep((s) => s + 1), 900);
      return () => clearTimeout(timer);
    } else {
      const endTimer = setTimeout(onFinish, 1000);
      return () => clearTimeout(endTimer);
    }
  }, [step, onFinish]);

  return (
    <div className="boot-screen">
      <div className="boot-box">
        <p className="boot-text">
          {step === 0 && ""}
          {step === 1 && "Initializing desktop..."}
          {step === 2 && "Loading assets..."}
          {step === 3 && "Starting GUI..."}
          {step >= 4 && (
            <>
              Desktop ready <img src={desktopIcon} alt="desktop" style={{ height: "1em", verticalAlign: "middle" }} />
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default BootScreen;
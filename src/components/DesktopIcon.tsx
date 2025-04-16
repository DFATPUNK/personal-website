import React from "react";
import "../styles/desktopIcon.css";

interface DesktopIconProps {
  icon: string;
  label: string;
  onClick: () => void;
  defaultX?: number;
  defaultY?: number;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({ icon, label, onClick }) => {
  return (
    <div className="desktop-icon" onClick={onClick}>
      <img src={icon} alt={label} className="desktop-icon-image" />
      <span className="desktop-icon-label">{label}</span>
    </div>
  );
};

export default DesktopIcon;
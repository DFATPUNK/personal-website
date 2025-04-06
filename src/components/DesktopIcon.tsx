import React from "react";
import "../styles/desktopIcon.css";

interface DesktopIconProps {
  icon: string;
  label: string;
  onDoubleClick: () => void;
  defaultX?: number;
  defaultY?: number;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({ icon, label, onDoubleClick }) => {
  return (
    <div className="desktop-icon" onDoubleClick={onDoubleClick}>
      <img src={icon} alt={label} className="desktop-icon-image" />
      <span className="desktop-icon-label">{label}</span>
    </div>
  );
};

export default DesktopIcon;
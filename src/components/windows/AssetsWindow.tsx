import { useWindowManager } from "../WindowManager";
import "../../styles/retroWindow.css";
import certificateIcon from "../../assets/icons/certificate.png";

export default function AssetsWindow() {
  const { openWindow } = useWindowManager();

  const openImage = (title: string, fileName: string) => {
    openWindow({
      title,
      minimized: false,
      content: (
        <img
          src={`/certificates/${fileName}`}
          width="100%"
          height="100%"
          style={{ border: "none" }}
          title={title}
        />
      ),
      width: 950,
      height: 680,
    });
  };

  return (
    <div className="window-content">
      <div 
        className="file-item"
        onClick={() => openImage("CS50 Certificate", "cs50.png")}
      >
      <img src={certificateIcon} className="start-menu-icon" />cs50.pdf
      </div>
      <p>Obtenu en 2016 avec un GPA de 1.0 (100%)</p>
      <div 
        className="file-item"
        onClick={() => openImage("Zapier Certificate", "zapier_certificate.png")}
      >
        <img src={certificateIcon} className="start-menu-icon" />zapier_certificate.pdf
      </div>
      <p>Je suis certifié Expert Zapier depuis Mars 2022.</p>
    </div>
  );
}

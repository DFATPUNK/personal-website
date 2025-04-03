import { useWindowManager } from "../WindowManager";
import "../../styles/retroWindow.css";

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
    <div className="p-4 space-y-2 text-sm font-mono">
      <div 
        className="file-item"
        onClick={() => openImage("CS50 Certificate", "cs50.png")}
      >
        📄 cs50.png
      </div>
      <div 
        className="file-item"
        onClick={() => openImage("Zapier Certificate", "zapier_certificate.png")}
      >
        📄 zapier_certificate.png
      </div>
    </div>
  );
}

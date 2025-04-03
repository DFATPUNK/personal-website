import { useWindowManager } from "./WindowManager";

interface DocumentLink {
  title: string;
  fileName: string;
  label?: string;
}

const documents: DocumentLink[] = [
  {
    title: "CV Jérémy Brunet",
    fileName: "CV-Jeremy-Brunet.pdf",
  },
  {
    title: "Diplôme CS50 (Harvard)",
    fileName: "Diplome-CS50.pdf",
  },
];

export default function DownloadWindowLauncher() {
  const { openWindow } = useWindowManager();

  return (
    <section className="mt-12">
      <h2 className="text-xl font-retro mb-4 border-b-2 border-retroBorder pb-1">
        <span role="img" aria-label="folder">
          📁
        </span>{" "}
        Documents à consulter
      </h2>
      <ul className="space-y-4">
        {documents.map((doc, index) => (
          <li key={index}>
            <p className="font-semibold">{doc.title}</p>
            <div className="flex items-center space-x-4 mt-1">
              <button
                className="bg-retroGray border border-retroBorder text-sm px-2 py-1 rounded shadow hover:bg-retroAccentLight transition"
                onClick={() =>
                  openWindow({
                    title: doc.title,
                    contentUrl: `/${doc.fileName}`,
                  })
                }
              >
                Voir
              </button>
              <a
                href={`/${doc.fileName}`}
                download
                className="text-retroAccent underline text-sm hover:text-retroAccentHover"
              >
                Télécharger
              </a>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
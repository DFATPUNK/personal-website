import ExperienceCard from "./ExperienceCard";
import { workExperiences } from "../data/work";
import { projectsDone } from "../data/projects";
import DownloadWindowLauncher from "./DownloadWindowLauncher";
import Footer from "./Footer";

export default function HomeWindow() {
  return (
    <div className="space-y-6 p-4 text-sm\">
      <header className="text-center\">
        <h1 className="text-3xl font-retro text-retroText mb-4\">Jérémy Brunet</h1>
        <p className="text-base font-modern text-gray-700\">
          Développeur low/no-code — full-stack & automatisation
        </p>
        <a
          href="/CV-Jeremy-Brunet.pdf\"
          className="mt-4 inline-block bg-retroAccent text-white px-4 py-2 rounded border border-retroBorder hover:bg-retroAccentHover transition\"
          download
        >
          Télécharger mon CV
        </a>
      </header>

      <main className="space-y-12\">
        <section>
          <h2 className="text-xl font-retro mb-2 border-b-2 border-retroBorder pb-1\">
            Expériences professionnelles
          </h2>
          {workExperiences.map((exp, idx) => (
            <ExperienceCard key={idx} {...exp} />
          ))}
        </section>

        <section>
          <h2 className="text-xl font-retro mb-2 border-b-2 border-retroBorder pb-1\">
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
  );
}
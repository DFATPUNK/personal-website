export default function Footer() {
  return (
    <footer className="bg-retroTaskbar border-t-2 border-retroTaskbarBorder text-retroText text-xs font-retro px-4 py-2 mt-12 text-center break-words">
      <p className="mb-1">
        © {new Date().getFullYear()} Jérémy Brunet — Tous droits réservés
      </p>
      <p>
        <a
          href="mailto:hellojeremybrunet@gmail.com"
          className="underline hover:text-retroAccent"
        >
          hellojeremybrunet@gmail.com
        </a>{" "}
        ·{" "}
        <a
          href="https://github.com/jeremybrunet"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-retroAccent"
        >
          GitHub
        </a>
      </p>
    </footer>
  );
}
import "../../styles/cvWindow.css";

export default function CVWindow() {
  return (
    <div className="cv-container">
      <div className="cv-contact">
        <h1>Jérémy Brunet</h1>
        <p>📞 +33665176323</p>
        <p>📧<a href="mailto:hellojeremybrunet@gmail.com">hellojeremybrunet@gmail.com</a></p>
      </div>

      <section className="cv-section">
        <h2>Expérience professionnelle</h2>
        <div>
          <h3>CTO – Automate Me <span className="cv-subtitle">(Jan. 2019 – Février 2025)</span></h3>
          <ul>
            <li>Agence spécialisée en automatisations de workflows & développement full-stack en low/no-code</li>
            <li>+1000 automatisations (Zapier, Make, Parabola), +100 bases Airtable créées, +100 webhooks en production</li>
          </ul>
        </div>
        <div>
          <h3>Founder – Peter <span className="cv-subtitle">(Nov. 2016 – Dec. 2018)</span></h3>
          <ul>
            <li>Chatbot Messenger d'entraide aux devoirs pour les collégiens et lycéens</li>
            <li>En charge du student care & support + hacking des manuels scolaires</li>
            <li>+400K étudiants growth hackés en moins de 15 jours</li>
            <li>Incubé chez The Family, seed round levé avec Kima Ventures</li>
          </ul>
        </div>
        <div>
          <h3>Chef de projet Marketing – Yooz <span className="cv-subtitle">(Fév. 2016 – Dec. 2016)</span></h3>
          <p>Lead generation & Scraping de Linkedin avec Rapportive & Hunter.</p>
        </div>
        <div>
          <h3>VP Sales Intl – Piscine Privée <span className="cv-subtitle">(Sept. 2012 – Juin 2015)</span></h3>
          <p>Gestion sales teams ES/IT/DE + budgets Adwords</p>
        </div>
      </section>

      <section className="cv-section">
        <h2>Formation</h2>
        <ul>
          <li>CS50 – HarvardX (2016)</li>
          <li>Master 2 NPI Anglais/Allemand – Université Montpellier III (2012)</li>
        </ul>
      </section>

      <section className="cv-section">
        <h2>Compétences</h2>
        <ul>
          <li>Automation : Zapier, Make, Parabola</li>
          <li>Full-stack : Retool, Airtable, Firebase</li>
          <li>Langages : JS, REST API, Python, SQL</li>
          <li>SaaS/API : Google, Xano, Zapier CLI, Stacker...</li>
        </ul>
      </section>
    </div>
  );
}
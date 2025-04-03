export default function CVWindow() {
  return (
    <div className="p-4 space-y-4 text-sm font-mono">
      <div>
        <h1 className="text-lg font-bold">Jérémy Brunet</h1>
        <p>📞 06 65 17 63 23</p>
        <p>📧 hellojeremybrunet@gmail.com</p>
      </div>

      <section>
        <h2 className="text-base font-bold border-b border-gray-400 pb-1">Expérience professionnelle</h2>
        <div>
          <p className="font-semibold">CTO – Automate Me <span className="text-gray-600">(Jan. 2019 – aujourd’hui)</span></p>
          <ul className="list-disc list-inside ml-4">
            <li>Agence spécialisée en automatisation et développement full-stack en low/no-code</li>
            <li>+1000 automatisations (Zapier, Make), +100 bases Airtable, +100 webhooks</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold">Founder – Peter <span className="text-gray-600">(Nov. 2016 – Dec. 2018)</span></p>
          <ul className="list-disc list-inside ml-4">
            <li>Chatbot Messenger pour collégiens/lycéens</li>
            <li>+400K étudiants, incubé chez The Family, levée chez Kima</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold">Chef de projet Marketing – Yooz <span className="text-gray-600">(Fév. 2016 – Dec. 2016)</span></p>
          <p className="ml-4">Scraping LinkedIn pour la lead gen</p>
        </div>
        <div>
          <p className="font-semibold">Resp. Sales & Marketing Intl – Piscine Privée <span className="text-gray-600">(Sept. 2012 – Juin 2015)</span></p>
          <p className="ml-4">Gestion ES/IT/DE + budgets Adwords</p>
        </div>
      </section>

      <section>
        <h2 className="text-base font-bold border-b border-gray-400 pb-1">Formation</h2>
        <ul className="list-disc list-inside ml-4">
          <li>CS50 – HarvardX (2016)</li>
          <li>Master 2 NPI Anglais/Allemand – Université Montpellier III (2012)</li>
        </ul>
      </section>

      <section>
        <h2 className="text-base font-bold border-b border-gray-400 pb-1">Compétences</h2>
        <ul className="list-disc list-inside ml-4">
          <li>Automation : Zapier, Make, Parabola</li>
          <li>Full-stack : Retool, Airtable, Firebase</li>
          <li>Langages : JS, REST API, SQL, Python</li>
          <li>SaaS/API : Google, Trello, Pipedrive, Stripe, Slack, etc.</li>
        </ul>
      </section>
    </div>
  );
}
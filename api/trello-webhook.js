export default async function handler(req, res) {
    if (req.method === "HEAD") {
      // Trello ping initial pour valider l'URL
      return res.status(200).end();
    }
  
    if (req.method === "POST") {
      // Pass-through vers ton webhook n8n (Production URL conseillé)
      const response = await fetch("https://jeremybrunet.app.n8n.cloud/webhook/balatro-hand-check", {
        method: "POST",
        headers: req.headers,
        body: req.body
      });
  
      // Répondre à Trello avec un 200 OK quoi qu’il arrive
      return res.status(200).end();
    }
  
    // Méthodes non autorisées
    res.status(405).json({ message: "Method not allowed" });
  }
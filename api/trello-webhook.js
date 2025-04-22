export default async function handler(req, res) {
    if (req.method === "HEAD") {
      return res.status(200).end();
    }
  
    if (req.method === "POST") {
      const headers = {
        "Content-Type": "application/json",
      };
  
      // Pass-through to n8n webhook
      await fetch("https://jeremybrunet.app.n8n.cloud/webhook/balatro-hand-check", {
        method: "POST",
        headers,
        body: JSON.stringify(req.body),
      });
  
      return res.status(200).end(); // Always reply OK to Trello
    }
  
    res.status(405).json({ message: "Method not allowed" });
  }  
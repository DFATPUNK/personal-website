import React from "react";
import "../../styles/retroWindow.css";

interface Article {
    title: string;
    url: string;
    description: React.ReactNode;
  }
  
const articles: Article[] = [
    { 
        title: "And the award for the best MOOC goes to…🥁",
        description: "", 
        url: "https://medium.com/free-code-camp/and-the-award-for-the-best-mooc-goes-to-308604e5bf2a" 
    },
    { 
        title: "How to scrap Didier Deschamps email", 
        description: (
            <p>
              Dans cet essai, j'explique ma stratégie customer care et comment j'ai réussi à opérer le support de milliers d'élèves sur <s>Front</s> Snapchat.
            </p>
          ), 
        url: "https://medium.com/hackernoon/how-to-scrap-didier-deschamps-email-651891ebe1e4" 
    },
    { 
        title: "How to hack people loyalty with care?", 
        description: (
            <p>
              Dans cet essai, j'explique ma stratégie customer care et comment j'ai réussi à opérer le support de milliers d'élèves sur <s>Front</s> Snapchat.
            </p>
          ), 
        url: "https://medium.com/user-experience-design-1/how-to-hack-people-loyalty-with-care-f2ce9346c47c" 
    },
    { 
        title: "Peter, le chatbot d’aide aux devoirs, lève 400 000 euros pour élargir ses fonctionnalités", 
        description: "Article de presse paru chez Madyness",
        url: "https://www.maddyness.com/2017/10/24/exclu-peter-chatbot-aide-devoirs-leve-400-000-euros/" 
    }
];

const ArticlesWindow: React.FC = () => {
    return (
        <div className="p-4 text-sm">
        {articles.map((article) => (
          <div
            key={article.url}
            style={{ marginBottom: "1rem", width: "fit-content" }}
          >
            <div
              style={{ cursor: "pointer", color: "#1a0dab", fontSize: "1rem" }}
              onClick={() => window.open(article.url, "_blank")}
            >
              {article.title}
            </div>
            <div style={{ fontSize: "0.75rem", color: "#555" }}>
              {article.description}
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  export default ArticlesWindow;
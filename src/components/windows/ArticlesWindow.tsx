import React from "react";
import "../../styles/retroWindow.css";
import mediumIcon from "../../assets/icons/medium.png";
import maddynessIcon from "../../assets/icons/maddyness.jpg";

interface Article {
  title: string;
  url: string;
  description: React.ReactNode;
  icon: string;
}

interface ArticlesWindowProps {
  isNightMode?: boolean;
}

const articles: Article[] = [
  {
    title: "And the award for the best MOOC goes to…🥁",
    description: (
      <p>
        Une tentative d'essai sur le CS50, classe que j'ai suivi en 2016 et qui m'a transmis la passion pour la programmation.
        Je dis bien 'tentative' car freecodecamp.org a modifié le contenu original au point que le récit perde parfois de vue son sujet. Ce papier avait pour but de montrer comment David J. Malan réussit à engager des étudiants provenant de tout horizon académique et de tout niveau. Passer le CS50 - cours enseigné à tous les freshmen d'Harvard en Computer Science - sans avoir de connaissances en programmation et après avoir fait des études non-scientifiques m'ont prouvé qu'il était possible de tout apprendre dès lors qu'<b>un professeur nous enseigne comment apprendre</b>. Depuis ma certification, je n'ai jamais cessé d'apprendre à coder.
      </p>
    ),
    url: "https://medium.com/free-code-camp/and-the-award-for-the-best-mooc-goes-to-308604e5bf2a",
    icon: mediumIcon,
  },
  {
    title: "How to scrap Didier Deschamps email",
    description: (
      <p>
        Un drôle de tutoriel où j'explique comment j'ai deviné l'adresse e-mail de Didier Deschamps quelques jours avant la finale de la Coupe du Monde 2018 (il ne m'a jamais répondu). J'ai toujours aimé scraper, faire du 'packet sniffing' avec des proxys jusqu'à pouvoir reverse engineer des API endpoints.
      </p>
    ),
    url: "https://medium.com/hackernoon/how-to-scrap-didier-deschamps-email-651891ebe1e4",
    icon: mediumIcon,
  },
  {
    title: "How to hack people loyalty with care?",
    description: (
      <p>
        Mon essai préféré, j'y explique ma stratégie customer care et comment j'ai réussi à opérer le support de milliers d'élèves seul sur <s>Front</s> Snapchat grâce à quelques workflows et raccourcis clavier (et deux iPhones).
      </p>
    ),
    url: "https://medium.com/user-experience-design-1/how-to-hack-people-loyalty-with-care-f2ce9346c47c",
    icon: mediumIcon,
  },
  {
    title: "Peter, le chatbot d’aide aux devoirs, lève 400 000 euros pour élargir ses fonctionnalités",
    description: (
      <p>
        Article de presse paru chez Maddyness.
      </p>
    ),
    url: "https://www.maddyness.com/2017/10/24/exclu-peter-chatbot-aide-devoirs-leve-400-000-euros/",
    icon: maddynessIcon,
  },
];

const ArticlesWindow: React.FC<ArticlesWindowProps> = ({ isNightMode }) => {
  return (
    <div className={`p-4 text-sm ${isNightMode ? "night" : ""}`}>
      {articles.map((article) => (
        <div key={article.url}>
          <img src={article.icon} alt="icon" className="file-icon" />
          <div className={`article-title ${isNightMode ? "night" : ""}`}
            onClick={() => window.open(article.url, "_blank")}
          >
            {article.title}
          </div>
          <div className={`article-description ${isNightMode ? "night" : ""}`}>
            {article.description}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ArticlesWindow;
import { useState } from "react";

type ExperienceCardProps = {
  title: string;
  company: string;
  date: string;
  summary: string;
};

export default function ExperienceCard({ title, company, date, summary }: ExperienceCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="bg-retroGray border-2 border-retroBorder rounded-md p-4 shadow-md cursor-pointer transition-all duration-300 hover:shadow-lg"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-base font-retro text-retroText">
          {title} — {company}
        </h3>
        <p className="text-xs text-gray-600 font-modern">{date}</p>
      </div>

      {isOpen && (
        <p className="mt-3 text-sm leading-relaxed whitespace-pre-line font-modern text-retroText">
          {summary}
        </p>
      )}
    </div>
  );
}
interface ExplanationChipsProps {
  explanations: string[];
}

export default function ExplanationChips({ explanations }: ExplanationChipsProps) {
  if (!explanations || explanations.length === 0) return null;

  return (
    <ul className="chips" aria-label="Why this was recommended">
      {explanations.map((text, i) => (
        <li key={i} className="chip">
          {text}
        </li>
      ))}
    </ul>
  );
}

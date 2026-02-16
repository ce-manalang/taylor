import './StarterQuestions.css';

interface StarterQuestionsProps {
  onSelect: (question: string) => void;
  visible?: boolean;
}

const STARTER_QUESTIONS = [
  'Am I wasting my time on someone who doesn\u2019t care?',
  'Will this feeling ever pass?',
  'Am I strong enough to start over?',
];

export function StarterQuestions({
  onSelect,
  visible = false,
}: StarterQuestionsProps) {
  return (
    <div className={`starter-questions${visible ? ' visible' : ''}`}>
      {STARTER_QUESTIONS.map((question, index) => (
        <button
          key={question}
          type="button"
          onClick={() => onSelect(question)}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {question}
        </button>
      ))}
    </div>
  );
}

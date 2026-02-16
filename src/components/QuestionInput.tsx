import './QuestionInput.css';

interface QuestionInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  compact?: boolean;
}

export function QuestionInput({
  value,
  onChange,
  onSubmit,
  disabled = false,
  compact = false,
}: QuestionInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div
        className={`question-input-wrapper${compact ? ' compact' : ''}`}
      >
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ask Taylor..."
          disabled={disabled}
          maxLength={200}
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={value.trim().length === 0 || disabled}
          aria-label="Send question"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.5 10H16.5M16.5 10L11 4.5M16.5 10L11 15.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </form>
  );
}

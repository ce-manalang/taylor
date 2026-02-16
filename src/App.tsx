import { useState, useCallback } from 'react';
import { askQuestion } from './lib/api-client';
import { QuestionInput } from './components/QuestionInput';
import { LoadingDots } from './components/LoadingDots';
import { StarterQuestions } from './components/StarterQuestions';
import { LyricDisplay } from './components/LyricDisplay';
import { CopyButton } from './components/CopyButton';
import './App.css';

function App() {
  const [question, setQuestion] = useState('');
  const [lyric, setLyric] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [typingComplete, setTypingComplete] = useState(false);

  const handleSubmit = useCallback(async () => {
    const trimmed = question.trim();
    if (!trimmed || isLoading) return;

    setHasSubmitted(true);
    setIsLoading(true);
    setLyric(null);
    setError(null);
    setTypingComplete(false);

    const result = await askQuestion(trimmed);

    setIsLoading(false);
    if (result.error) {
      setError(result.error);
    } else if (result.lyric) {
      setLyric(result.lyric);
    }
  }, [question, isLoading]);

  const handleStarterSelect = useCallback((q: string) => {
    setQuestion(q);
  }, []);

  const handleReset = useCallback(() => {
    setQuestion('');
    setLyric(null);
    setError(null);
    setHasSubmitted(false);
    setTypingComplete(false);
  }, []);

  // Stable callback — prevents LyricDisplay effect from re-running
  // (setTypingComplete is stable per React guarantees)
  const handleAnimationComplete = useCallback(() => {
    setTypingComplete(true);
  }, []);

  const showResponse = hasSubmitted && (isLoading || lyric || error);

  return (
    <div className={`app-container ${hasSubmitted ? 'submitted' : ''}`}>
      <div className="app-input-area">
        <QuestionInput
          value={question}
          onChange={setQuestion}
          onSubmit={handleSubmit}
          disabled={isLoading}
          compact={hasSubmitted}
        />
        {!hasSubmitted && (
          <StarterQuestions
            onSelect={handleStarterSelect}
            visible={!hasSubmitted}
          />
        )}
      </div>

      {showResponse && (
        <div className="app-response-area">
          {isLoading && <LoadingDots />}

          {error && (
            <p className="app-error">{error}</p>
          )}

          {lyric && !isLoading && (
            <>
              <LyricDisplay
                lyric={lyric}
                onAnimationComplete={handleAnimationComplete}
              />
              {typingComplete && (
                <div className="app-actions">
                  <CopyButton text={lyric} />
                </div>
              )}
            </>
          )}

          {((lyric && typingComplete) || error) && !isLoading && (
            <button
              type="button"
              className="app-reset-button"
              onClick={handleReset}
            >
              Ask another
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default App;

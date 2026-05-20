import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Trophy, Zap, Target, Lightbulb, CheckCircle2, XCircle } from "lucide-react";
import styles from "./QuizComponent.module.css";
import { useGamification } from "../../context/GamificationContext";
import { useAuth } from "../../context/AuthContext";

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

export interface QuizComponentProps {
  quizId: string;
  questions: QuizQuestion[];
  onComplete?: () => void;
  title?: string;
}

/**
 * QuizComponent renders an interactive quiz interface.
 * On completion, it calculates the user's score and awards gamification XP
 * through the AuthContext (Firestore) and GamificationContext (Toasts).
 */
export default function QuizComponent({ quizId, questions, onComplete, title = "Quiz Time" }: QuizComponentProps) {
  const { addXp } = useGamification();
  const { user, updateUserProfile } = useAuth();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Reset state if quizId changes
  useEffect(() => {
    setCurrentQuestion(0);
    setSelectedAnswer("");
    setScore(0);
    setShowResult(false);
    setShowFeedback(false);
    setSubmitError(null);
  }, [quizId]);

  const saveProgress = async (updatedScore: number) => {
    setSubmitError(null);
    setIsSubmitting(true);
    const isPerfect = updatedScore === questions.length;
    const passed = updatedScore >= Math.ceil(questions.length * 0.7);

    try {
      if (user && user.email !== "devpathind.community@gmail.com") {
        const completed = user.completedQuizzes || [];
        
        // Only award XP if not already completed and passed
        if (!completed.includes(quizId) && passed) {
          const { arrayUnion, increment } = await import('firebase/firestore');
          const pointsEarned = isPerfect ? 350 : 200;
          
          // Update Firestore
          await updateUserProfile({
            completedQuizzes: arrayUnion(quizId) as any,
            points: increment(pointsEarned) as any
          });

          // Trigger confetti only after successful update
          if (isPerfect) {
            triggerConfetti();
          }

          // Firestore already received the points update above; this call only shows feedback.
          addXp(
            pointsEarned,
            isPerfect ? "Perfect Quiz Score!" : "Passed Quiz Successfully!",
            "xp",
            { persist: false }
          );
        } else if (passed && isPerfect) {
          triggerConfetti();
        }
      } else if (!user) {
        // For unauthenticated testing
        if (isPerfect) {
          triggerConfetti();
          addXp(350, "Perfect Quiz Score!");
        } else if (passed) {
          addXp(200, "Passed Quiz Successfully!");
        }
      }
    } catch (error) {
      console.error("Failed to update quiz progress:", error);
      setSubmitError("Failed to save progress. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuizSubmit = async () => {
    if (isSubmitting) return;
    const current = questions[currentQuestion];
    setShowFeedback(true);

    let updatedScore = score;
    if (selectedAnswer === current.answer) {
      updatedScore += 1;
      setScore(updatedScore);
    }

    setTimeout(async () => {
      setShowFeedback(false);

      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer("");
      } else {
        // Quiz completed
        setShowResult(true);
        await saveProgress(updatedScore);
      }
    }, 1200);
  };

  const triggerConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: ReturnType<typeof setInterval> = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
  };

  if (showResult) {
    const isPerfect = score === questions.length;
    const passed = score >= Math.ceil(questions.length * 0.7);

    return (
      <div className={styles.resultContainer}>
        <h2 className={styles.resultTitle}>
          Quiz Completed <Trophy size={28} className="inline-block text-yellow-500 mb-1" />
        </h2>
        <p className={styles.resultScore}>
          Your Score: {score} / {questions.length}
        </p>

        {isPerfect ? (
          <p className={styles.perfectFeedback}>
            Perfect Score! +350 XP <Zap size={20} className="inline-block text-emerald-500 mb-1" />
          </p>
        ) : passed ? (
          <p className={styles.passedFeedback}>
            Great Job! +200 XP <Target size={20} className="inline-block text-primary mb-1" />
          </p>
        ) : (
          <p className={styles.failedFeedback}>
            Keep Practicing <Lightbulb size={20} className="inline-block text-yellow-500 mb-1" />
          </p>
        )}

        {submitError && (
          <div style={{
            padding: '1rem',
            marginTop: '1.5rem',
            marginBottom: '1rem',
            fontSize: '0.875rem',
            color: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            width: '100%',
            textAlign: 'left'
          }}>
            <span>{submitError}</span>
            <button 
              onClick={() => saveProgress(score)}
              disabled={isSubmitting}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                opacity: isSubmitting ? 0.5 : 1,
                transition: 'opacity 0.2s'
              }}
            >
              {isSubmitting ? "Retrying..." : "Try Again"}
            </button>
          </div>
        )}

        <div className={styles.actionButtons}>
          <button
            className={styles.retryButton}
            onClick={() => {
              setCurrentQuestion(0);
              setSelectedAnswer("");
              setScore(0);
              setShowResult(false);
              setSubmitError(null);
            }}
          >
            Retake Quiz
          </button>
          {onComplete && (
            <button className={styles.completeButton} onClick={onComplete}>
              Continue
            </button>
          )}
        </div>
      </div>
    );
  }

  const current = questions[currentQuestion];

  return (
    <div className={styles.quizContainer}>
      <div className={styles.quizHeader}>
        <h3 className={styles.quizTitle}>{title}</h3>
        <span className={styles.quizProgress}>
          Question {currentQuestion + 1} / {questions.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div className={styles.progressBarContainer}>
        <div 
          className={styles.progressBarFill} 
          style={{ width: `${((currentQuestion) / questions.length) * 100}%` }}
        />
      </div>

      <div className={styles.questionCard}>
        <h2 className={styles.questionText}>{current.question}</h2>

        <div className={styles.optionsContainer}>
          {current.options.map((option) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = option === current.answer;
            
            let optionClass = styles.optionButton;
            if (isSelected) optionClass += ` ${styles.selected}`;
            
            if (showFeedback) {
              if (isCorrect) optionClass += ` ${styles.correct}`;
              else if (isSelected) optionClass += ` ${styles.incorrect}`;
            }

            return (
              <button
                key={option}
                className={optionClass}
                disabled={showFeedback}
                onClick={() => setSelectedAnswer(option)}
              >
                {option}
              </button>
            );
          })}
        </div>

        {showFeedback && (
          <div className={`${styles.feedbackText} ${selectedAnswer === current.answer ? styles.feedbackCorrect : styles.feedbackIncorrect}`}>
            {selectedAnswer === current.answer ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Correct Answer <CheckCircle2 size={18} /></span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Wrong Answer <XCircle size={18} /></span>
            )}
          </div>
        )}

        <button
          className={styles.nextButton}
          disabled={!selectedAnswer || showFeedback}
          onClick={handleQuizSubmit}
        >
          {currentQuestion === questions.length - 1 ? "Finish Quiz" : "Submit Answer"}
        </button>
      </div>
    </div>
  );
}

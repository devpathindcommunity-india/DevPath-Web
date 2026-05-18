import { useState } from "react";
import styles from "./QuizComponent.module.css";
import { useGamification } from "../../context/GamificationContext";

const questions = [
  {
    question: "What is React?",
    options: ["Library", "Framework", "Database", "Language"],
    answer: "Library",
  },
  {
    question: "What hook manages state?",
    options: ["useRef", "useEffect", "useState", "useMemo"],
    answer: "useState",
  },
];

export default function QuizComponent() {
  const { addXp } = useGamification();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleNext = () => {
    const current = questions[currentQuestion];

    let updatedScore = score;

    if (selectedAnswer === current.answer) {
      updatedScore += 1;
      setScore(updatedScore);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer("");
    } else {
      setShowResult(true);

      if (updatedScore === questions.length) {
        addXp(350, "Perfect Quiz Score");
      } else if (updatedScore >= Math.ceil(questions.length * 0.7)) {
        addXp(200, "Quiz Completed");
      }
    }
  };

  if (showResult) {
    return (
      <div className={styles.resultContainer}>
        <h2>Quiz Completed 🎉</h2>
        <p>
          Your Score: {score}/{questions.length}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.quizContainer}>
      <h2>{questions[currentQuestion].question}</h2>

      <div className={styles.optionsContainer}>
        {questions[currentQuestion].options.map((option) => (
          <button
            key={option}
            className={`${styles.optionButton} ${
              selectedAnswer === option ? styles.selected : ""
            }`}
            onClick={() => setSelectedAnswer(option)}
          >
            {option}
          </button>
        ))}
      </div>

      <button
        className={styles.nextButton}
        disabled={!selectedAnswer}
        onClick={handleNext}
      >
        {currentQuestion === questions.length - 1
          ? "Finish Quiz"
          : "Next"}
      </button>
    </div>
  );
}
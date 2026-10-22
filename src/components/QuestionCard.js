import AnswerButton from "./AnswerButton";
import { LETTERS } from "../data";

const QuestionCard = ({
  number,
  total,
  question,
  options,
  answerStates,
  disabled,
  onSelect,
}) => (
  <div className="question-card">
    <p className="question-number">{`Câu ${number}/${total}`}</p>
    <h2>{question}</h2>
    <div className="answers-grid">
      {options.map((option, i) => (
        <AnswerButton
          key={i}
          letter={LETTERS[i]}
          text={option}
          state={answerStates[i]}
          disabled={disabled}
          onClick={() => onSelect(i)}
        />
      ))}
    </div>
  </div>
);

export default QuestionCard;

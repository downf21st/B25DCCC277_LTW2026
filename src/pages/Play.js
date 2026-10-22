import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import QuestionCard from "../components/QuestionCard";
import Timer from "../components/Timer";
import MoneyLadder from "../components/MoneyLadder";
import { TIME_PER_QUESTION } from "../data";
import { calcPrize } from "../utils";

const GameScreen = ({ questions, playerName, onComplete }) => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState("answering");
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);

  const q = questions[index];
  const total = questions.length;

  useEffect(() => {
    if (status !== "answering") return;
    const timerId = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timerId);
  }, [status, index]);

  useEffect(() => {
    if (status === "answering" && timeLeft <= 0) setStatus("revealed");
  }, [status, timeLeft]);

  useEffect(() => {
    if (status === "locked") {
      const id = setTimeout(() => setStatus("revealed"), 1000);
      return () => clearTimeout(id);
    }
    if (status === "revealed") {
      const id = setTimeout(() => {
        const isCorrect = selected === q.answer;
        if (isCorrect && index < total - 1) {
          setIndex(index + 1);
          setSelected(null);
          setTimeLeft(TIME_PER_QUESTION);
          setStatus("answering");
          return;
        }
        let reason = "wrong";
        if (isCorrect) reason = "win";
        else if (selected === null) reason = "timeout";
        const correctCount = isCorrect ? index + 1 : index;
        const prize = calcPrize(correctCount, reason);
        onComplete({
          name: playerName,
          prize,
          correctCount,
          playedAt: new Date().toLocaleString("vi-VN"),
        });
        navigate("/result", {
          replace: true,
          state: {
            name: playerName,
            prize,
            correctCount,
            reason,
          },
        });
      }, 2000);
      return () => clearTimeout(id);
    }
  }, [status, selected, index, q, total, navigate, playerName, onComplete]);

  const handleSelect = (i) => {
    if (status !== "answering") return;
    setSelected(i);
    setStatus("locked");
  };

  const answerStates = q.options.map((_, i) => {
    if (status === "locked" && selected === i) return "selected";
    if (status === "revealed") {
      if (i === q.answer) return "correct";
      if (i === selected) return "wrong";
    }
    return "default";
  });

  return (
    <div className="play-layout">
      <div className="play-main">
        <Timer timeLeft={timeLeft} />
        <QuestionCard
          number={index + 1}
          total={total}
          question={q.question}
          options={q.options}
          answerStates={answerStates}
          disabled={status !== "answering"}
          onSelect={handleSelect}
        />
      </div>
      <MoneyLadder current={index + 1} />
    </div>
  );
};

const Play = ({ questions, loading, error, playerName, onComplete }) => {
  if (playerName.trim() === "") return <Navigate to="/" replace />;
  if (loading) return <p>Đang tải câu hỏi...</p>;
  if (error || questions.length === 0) return <p>Không tải được câu hỏi.</p>;
  return (
    <GameScreen
      questions={questions}
      playerName={playerName}
      onComplete={onComplete}
    />
  );
};

export default Play;

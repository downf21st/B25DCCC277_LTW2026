import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import "./App.css";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Play from "./pages/Play";
import Result from "./pages/Result";
import History from "./pages/History";
import QuestionBank from "./pages/QuestionBank";
import QuestionDetail from "./pages/QuestionDetail";
import NotFound from "./pages/NotFound";

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    axios
      .get("/data/question.json", { signal: controller.signal })
      .then((res) => {
        setQuestions(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (axios.isCancel(err)) return; 
        setError(true);
        setLoading(false);
      });
    return () => controller.abort();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            <Home
              playerName={playerName}
              setPlayerName={setPlayerName}
              history={history}
            />
          }
        />
        <Route
          path="play"
          element={
            <Play
              questions={questions}
              loading={loading}
              error={error}
              playerName={playerName}
              onComplete={(result) =>
                setHistory((items) => [{ ...result, id: Date.now() }, ...items])
              }
            />
          }
        />
        <Route path="result" element={<Result />} />
        <Route
          path="history"
          element={
            <History history={history} onClear={() => setHistory([])} />
          }
        />
        <Route
          path="questions"
          element={
            <QuestionBank
              questions={questions}
              loading={loading}
              error={error}
            />
          }
        />
        <Route
          path="questions/:id"
          element={
            <QuestionDetail
              questions={questions}
              loading={loading}
              error={error}
            />
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;

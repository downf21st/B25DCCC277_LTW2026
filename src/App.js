import { useState } from "react";
import "./App.css";
import StudentList from "./StudentList";

function App() {
  const [students, setStudent] = useState([
    { id: 1, name: "Nguyễn Đức Đông", score: 5, className: "Lập trình web" },
    { id: 2, name: "Nguyễn Thị Nga", score: 10, className: "Lập trình web" },
    { id: 3, name: "Nguyễn Tiến Hiếu", score: 10, className: "Marketing" },
  ]);

  const [newName, setNewName] = useState("");
  const [newScore, setNewScore] = useState("");
  const [newClass, setNewClass] = useState("");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredStudents = students.filter((student) => {
    if (filter === "giỏi") return student.score > 8;
    if (filter === "trượt") return student.score < 5;
    return true;
  });

  const totalStudents = students.length;
  const averageScore =
    totalStudents > 0
      ? (
          students.reduce((sum, student) => sum + student.score, 0) /
          totalStudents
        ).toFixed(1)
      : 0;

  const handleAddStudent = (e) => {
    e.preventDefault();

    const name = newName.trim();
    const className = newClass.trim();
    const score = Number(newScore);

    if (!name || !className || Number.isNaN(score) || score < 0 || score > 10) {
      setError("Vui lòng nhập đầy đủ thông tin và điểm số từ 0 đến 10.");
      return;
    }

    setStudent((prev) => [
      ...prev,
      {
        id: prev.length ? prev[prev.length - 1].id + 1 : 1,
        name,
        score,
        className,
      },
    ]);

    setNewName("");
    setNewScore("");
    setNewClass("");
    setError("");
  };

  const handleDeleteStudent = (studentId) => {
    setStudent((prev) => prev.filter((student) => student.id !== studentId));
  };

  return (
    <>
      <h1>Quản lý điểm sinh viên PTIT</h1>
      <div className="form-container">
        <form onSubmit={handleAddStudent}>
          <input
            type="text"
            className="Name"
            placeholder="Họ tên"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <input
            type="number"
            className="Score"
            placeholder="Điểm số"
            value={newScore}
            onChange={(e) => setNewScore(e.target.value)}
          />
          <input
            type="text"
            className="class"
            placeholder="Lớp"
            value={newClass}
            onChange={(e) => setNewClass(e.target.value)}
          />
          <button type="submit">Thêm sinh viên</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>

        <div>
          <button type="button" onClick={() => setFilter("all")}>
            Tất cả
          </button>
          <button type="button" onClick={() => setFilter("giỏi")}>
            Giỏi
          </button>
          <button type="button" onClick={() => setFilter("trượt")}>
            Trượt
          </button>
        </div>

        <p>Tổng số lượng sinh viên: {totalStudents}</p>
        <p>Điểm trung bình của toàn lớp: {averageScore}</p>

        <StudentList
          students={filteredStudents}
          onDelete={handleDeleteStudent}
        />
      </div>
    </>
  );
}

export default App;

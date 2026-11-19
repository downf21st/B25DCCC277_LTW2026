import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import { SEMESTERS, formatPoint } from "./data";
import { calcStats, getGrade } from "./utils";
import { useFetch } from "./hooks/useFetch";
import {
  selectCourses,
  setCourses,
  setScore,
  removeCourse,
} from "./features/coursesSlice";
import { useTheme } from "./context/ThemeContext";
import { useNotice } from "./context/NoticeContext";
import { AddCourseForm } from "./components/AddCourseForm";
import { GoalPlanner } from "./components/GoalPlanner";
const BUILD_TAG = "gp-4073";

const App = () => {
  const { data, loading, error } = useFetch("/data/courses.json");
  const courses = useSelector(selectCourses);
  const dispatch = useDispatch();
  const { theme, toggleTheme } = useTheme();
  const showNotice = useNotice();
  const [semester, setSemester] = useState("all");

  useEffect(() => {
    if (data) dispatch(setCourses(data));
  }, [data, dispatch]);
  const visibleCourses = useMemo(
    () =>
      semester === "all"
        ? courses
        : courses.filter((course) => course.semester === semester),
    [courses, semester],
  );
  const visibleStats = useMemo(
    () => calcStats(visibleCourses),
    [visibleCourses],
  );
  const cumulativeStats = useMemo(() => calcStats(courses), [courses]);

  return (
    <div className={`app-shell ${theme}`} data-build={BUILD_TAG}>
      <header className="page-header">
        <p className="eyebrow">SỔ THEO DÕI HỌC TẬP</p>
        <h1>Sổ điểm sinh viên</h1>
        <button className="theme-button" onClick={toggleTheme}>
          {theme === "light" ? "Chế độ tối" : "Chế độ sáng"}
        </button>
      </header>
      {loading && (
        <p className="notice" role="status">
          Đang tải bảng điểm...
        </p>
      )}
      {error && courses.length === 0 && (
        <p className="notice error-notice" role="alert">
          Không tải được bảng điểm.
        </p>
      )}
      <main>
        <section className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">TỔNG QUAN</p>
              <h2>Thống kê</h2>
            </div>
          </div>
          <div className="stats-grid">
            <Stat label="Số môn" value={visibleStats.count} />
            <Stat label="Tổng tín chỉ" value={visibleStats.credits} />
            <Stat label="GPA (hệ 4)" value={visibleStats.gpa.toFixed(2)} />
            <Stat label="Xếp loại" value={visibleStats.rank} />
            <Stat label="GPA tích lũy" value={cumulativeStats.gpa.toFixed(2)} />
          </div>
        </section>
        <section className="panel">
          <div className="section-heading course-heading">
            <div>
              <p className="eyebrow">BẢNG ĐIỂM</p>
              <h2>Môn học</h2>
            </div>
            <label className="semester-filter" htmlFor="semester-filter">
              Xem học kỳ
              <select
                id="semester-filter"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
              >
                <option value="all">Tất cả</option>
                {SEMESTERS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
          </div>
          {visibleCourses.length === 0 ? (
            <p className="empty-state">Chưa có môn học nào</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Mã môn</th>
                    <th>Tên môn</th>
                    <th>Tín chỉ</th>
                    <th>Học kỳ</th>
                    <th>Điểm (hệ 10)</th>
                    <th>Điểm chữ</th>
                    <th>Điểm (hệ 4)</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {visibleCourses.map((course) => {
                    const grade = getGrade(course.score),
                      failed = grade.letter === "F";
                    return (
                      <tr
                        key={course.id}
                        className={failed ? "failed-course" : ""}
                      >
                        <td>{course.code}</td>
                        <td className="course-name">{course.name}</td>
                        <td>{course.credits}</td>
                        <td>{course.semester}</td>
                        <td>
                          <input
                            aria-label={`Điểm ${course.name}`}
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            value={course.score}
                            onChange={(e) => {
                              const score = e.currentTarget.valueAsNumber;
                              if (score >= 0 && score <= 10)
                                dispatch(setScore({ id: course.id, score }));
                            }}
                          />
                        </td>
                        <td>{failed ? "F – Học lại" : grade.letter}</td>
                        <td>{formatPoint(grade.point)}</td>
                        <td>
                          <button
                            className="delete-button"
                            aria-label={`Xóa ${course.name}`}
                            onClick={() => {
                              dispatch(removeCourse(course.id));
                              showNotice(`Đã xóa môn ${course.name}`);
                            }}
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
        <GoalPlanner />
        <AddCourseForm />
      </main>
    </div>
  );
};
const Stat = ({ label, value }) => (
  <div className="stat-card">
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
);

export default App;

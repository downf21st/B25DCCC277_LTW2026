import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import { GRADES, SEMESTERS } from "./data";
import { getGrade } from "./utils";
import { useFetch } from "./hooks/useFetch";
import { useDebounce } from "./hooks/useDebounce";
import {
  selectCourses,
  setCourses,
  setScore,
  removeCourse,
  restoreCourse,
} from "./features/coursesSlice";
import {
  selectCumulativeStats,
  selectSemesterCourses,
  selectSemesterStats,
} from "./features/selectors";
import { rememberDeleted, clearUndo } from "./features/undoSlice";
import { hasSaved } from "./store";
import { useTheme } from "./context/ThemeContext";
import { useNotice } from "./context/NoticeContext";
import { AddCourseForm } from "./components/AddCourseForm";
import { GoalPlanner } from "./components/GoalPlanner";
import CourseRow from "./components/CourseRow";
const BUILD_TAG = "gp-4073";
const columns = [
  { key: "code", label: "Mã môn" },
  { key: "name", label: "Tên môn" },
  { key: "credits", label: "Tín chỉ" },
  { key: "semester", label: "Học kỳ" },
  { key: "score", label: "Điểm (hệ 10)" },
  { key: "letter", label: "Điểm chữ" },
  { key: "point", label: "Điểm (hệ 4)" },
];
const App = () => {
  const { data, loading, error } = useFetch("/data/courses.json"),
    courses = useSelector(selectCourses),
    deleted = useSelector((s) => s.undo),
    dispatch = useDispatch();
  const { theme, toggleTheme } = useTheme(),
    showNotice = useNotice();
  const [semester, setSemester] = useState(() => {
      try {
        return localStorage.getItem("ltw_sodiem_semester") || "all";
      } catch {
        return "all";
      }
    }),
    [search, setSearch] = useState(""),
    [sort, setSort] = useState({ key: "", direction: 1 });
  const debouncedSearch = useDebounce(search, 300),
    searchRef = useRef(null);
  useEffect(() => {
    try {
      localStorage.setItem("ltw_sodiem_semester", semester);
    } catch {}
  }, [semester]);
  useEffect(() => {
    if (data && !hasSaved) dispatch(setCourses(data));
  }, [data, dispatch]);
  useEffect(() => {
    const handleKey = (e) => {
      const t = e.target,
        typing = t.matches("input,select,textarea") || t.isContentEditable;
      if (e.key === "/" && !typing) {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape" && t === searchRef.current) setSearch("");
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);
  const semesterCourses = useSelector((state) =>
    selectSemesterCourses(state, semester),
  );
  const visibleCourses = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    let list = semesterCourses.filter(
      (c) =>
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q),
    );
    if (sort.key) {
      list = [...list].sort((a, b) => {
        const av =
            sort.key === "letter"
              ? getGrade(a.score).letter
              : sort.key === "point"
                ? getGrade(a.score).point
                : a[sort.key],
          bv =
            sort.key === "letter"
              ? getGrade(b.score).letter
              : sort.key === "point"
                ? getGrade(b.score).point
                : b[sort.key];
        const cmp =
          typeof av === "number"
            ? av - bv
            : String(av).localeCompare(String(bv), "vi");
        return cmp * sort.direction;
      });
    }
    return list;
  }, [semesterCourses, debouncedSearch, sort]);
  const stats = useSelector((state) => selectSemesterStats(state, semester)),
    cumulative = useSelector(selectCumulativeStats);
  const gradeCounts = useMemo(
    () =>
      GRADES.map((g) => ({
        ...g,
        count: semesterCourses.filter(
          (c) => getGrade(c.score).letter === g.letter,
        ).length,
      })),
    [semesterCourses],
  );
  const handleScore = useCallback(
    (id, score) => dispatch(setScore({ id, score })),
    [dispatch],
  );
  const handleRemove = useCallback(
    (course) => {
      dispatch(rememberDeleted(course));
      dispatch(removeCourse(course.id));
      showNotice(`Đã xóa môn ${course.name}`);
    },
    [dispatch, showNotice],
  );
  const handleUndo = useCallback(() => {
    if (!deleted) return;
    dispatch(restoreCourse(deleted));
    dispatch(clearUndo());
    showNotice(`Đã hoàn tác xóa môn ${deleted.name}`);
  }, [deleted, dispatch, showNotice]);
  const handleCourseShift = (e) => setSearch(e.target.value);
  const sortBy = (key) =>
    setSort((current) => ({
      key,
      direction: current.key === key ? -current.direction : 1,
    }));
  const exportCsv = () => {
    const exportedAt = new Intl.DateTimeFormat("vi-VN", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date());
    const rows = [
      ["SỔ ĐIỂM SINH VIÊN"],
      ["Ngày xuất", exportedAt],
      ["Học kỳ", semester === "all" ? "Tất cả học kỳ" : semester],
      ["Từ khóa tìm kiếm", debouncedSearch.trim() || "Không có"],
      [],
      ["TÓM TẮT"],
      ["Số môn trong bảng", visibleCourses.length],
      ["Tổng tín chỉ học kỳ đang xem", stats.credits],
      ["GPA học kỳ đang xem", stats.gpa.toFixed(2)],
      ["Xếp loại học kỳ đang xem", stats.rank],
      ["GPA tích lũy", cumulative.gpa.toFixed(2)],
      [],
      ["PHÂN BỐ ĐIỂM CHỮ"],
      ["Điểm chữ", "Số môn"],
      ...gradeCounts.map((grade) => [grade.letter, grade.count]),
      [],
      ["BẢNG ĐIỂM"],
      [
        "Mã môn",
        "Tên môn",
        "Tín chỉ",
        "Học kỳ",
        "Điểm hệ 10",
        "Điểm chữ",
        "Điểm hệ 4",
      ],
      ...visibleCourses.map((course) => [
        course.code,
        course.name,
        course.credits,
        course.semester,
        course.score,
        getGrade(course.score).letter,
        getGrade(course.score).point.toFixed(1),
      ]),
    ];
    const escapeCell = (value) => {
      const text = String(value ?? "");
      const safeText =
        typeof value === "string" && /^[=+@\\-\\t\\r]/.test(text)
          ? `'${text}`
          : text;
      return `"${safeText.replaceAll('"', '""')}"`;
    };
    const csv =
      "\uFEFF" + rows.map((row) => row.map(escapeCell).join(",")).join("\r\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "so-diem.csv";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  useEffect(() => {
    document.title = courses.length
      ? `GPA ${cumulative.gpa.toFixed(2)} – Sổ điểm`
      : "Sổ điểm";
  }, [courses.length, cumulative.gpa]);
  return (
    <div className={`app-shell ${theme}`} data-build={BUILD_TAG}>
      <header className="page-header">
        <p className="eyebrow">SỔ THEO DÕI HỌC TẬP</p>
        <h1>Sổ điểm sinh viên</h1>
        <button className="theme-button" onClick={toggleTheme}>
          {theme === "light" ? "Chế độ tối" : "Chế độ sáng"}
        </button>
      </header>
      {loading && !hasSaved && (
        <p className="notice" role="status">
          Đang tải bảng điểm...
        </p>
      )}
      {error && !hasSaved && !courses.length && (
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
            <Stat label="Số môn" value={stats.count} />
            <Stat label="Tổng tín chỉ" value={stats.credits} />
            <Stat label="GPA (hệ 4)" value={stats.gpa.toFixed(2)} />
            <Stat label="Xếp loại" value={stats.rank} />
            <Stat label="GPA tích lũy" value={cumulative.gpa.toFixed(2)} />
          </div>
          <h3 className="distribution-title">Phân bố điểm chữ</h3>
          <ul className="grade-distribution">
            {gradeCounts.map((g) => (
              <li key={g.letter}>
                <span>
                  {g.letter}: {g.count}
                </span>
                <span className="grade-bar" style={{ width: g.count * 24 }} />
              </li>
            ))}
          </ul>
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
          <div className="search-row">
            <label htmlFor="course-search">Tìm môn học</label>
            <input
              id="course-search"
              ref={searchRef}
              value={search}
              onChange={handleCourseShift}
              placeholder="Nhập tên hoặc mã môn"
            />
            <span>Tìm thấy {visibleCourses.length} môn</span>
          </div>
          <div className="challenge-actions">
            <button
              className="reset-button"
              disabled={!data}
              onClick={() => {
                dispatch(setCourses(data));
                showNotice("Đã đặt lại dữ liệu mẫu");
              }}
            >
              Đặt lại dữ liệu mẫu
            </button>
            <button className="reset-button" onClick={exportCsv}>
              Xuất CSV
            </button>
            {deleted && (
              <button className="reset-button" onClick={handleUndo}>
                Hoàn tác xóa {deleted.name}
              </button>
            )}
          </div>
          {visibleCourses.length === 0 ? (
            <p className="empty-state">Chưa có môn học nào</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    {columns.map((col) => (
                      <th key={col.key}>
                        <button
                          className="sort-button"
                          onClick={() => sortBy(col.key)}
                        >
                          {col.label}
                          {sort.key === col.key
                            ? sort.direction === 1
                              ? " ↑"
                              : " ↓"
                            : ""}
                        </button>
                      </th>
                    ))}
                    <th>Số lần render</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {visibleCourses.map((course) => (
                    <CourseRow
                      key={course.id}
                      course={course}
                      onScore={handleScore}
                      onRemove={handleRemove}
                    />
                  ))}
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

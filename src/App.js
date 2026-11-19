import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import "./App.css";
import { CREDIT_OPTIONS, SEMESTERS, formatPoint } from "./data";
import { calcStats, getGrade } from "./utils";
import { coursesReducer } from "./coursesReducer";
import { useFetch } from "./hooks/useFetch";

const BUILD_TAG = "gp-4073";

const emptyForm = {
  code: "",
  name: "",
  credits: "3",
  semester: SEMESTERS[0],
  score: "",
};

const App = () => {
  const { data, loading, error } = useFetch("/data/courses.json");
  const [courses, dispatch] = useReducer(coursesReducer, []);
  const [semester, setSemester] = useState("all");
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const codeInputRef = useRef(null);

  useEffect(() => {
    if (data) dispatch({ type: "LOAD", payload: data });
  }, [data]);

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

  const updateForm = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const handleAddCourse = (event) => {
    event.preventDefault();
    const normalizedCode = form.code.trim().toUpperCase();
    const nextErrors = {};
    if (!normalizedCode) nextErrors.code = "Hãy nhập mã môn";
    else if (
      courses.some(
        (course) => course.code.trim().toUpperCase() === normalizedCode,
      )
    ) {
      nextErrors.code = "Mã môn đã tồn tại";
    }
    if (!form.name.trim()) nextErrors.name = "Hãy nhập tên môn";
    const score = Number(form.score);
    if (
      form.score === "" ||
      !Number.isFinite(score) ||
      score < 0 ||
      score > 10
    ) {
      nextErrors.score = "Điểm phải từ 0 đến 10";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    dispatch({
      type: "ADD",
      payload: {
        code: normalizedCode,
        name: form.name.trim(),
        credits: Number(form.credits),
        semester: form.semester,
        score,
      },
    });
    setForm(emptyForm);
    codeInputRef.current.focus();
  };

  return (
    <div className="app-shell" data-build={BUILD_TAG}>
      <header className="page-header">
        <p className="eyebrow">SỔ THEO DÕI HỌC TẬP</p>
        <h1>Sổ điểm sinh viên</h1>
        <p className="subtitle">Theo dõi điểm số và tiến độ học tập của bạn.</p>
      </header>

      {loading && (
        <p className="notice" role="status">
          Đang tải bảng điểm...
        </p>
      )}
      {error && (
        <p className="notice error-notice" role="alert">
          Không tải được bảng điểm.
        </p>
      )}

      {!loading && !error && (
        <main>
          <section className="panel stats-panel" aria-labelledby="stats-title">
            <div className="section-heading">
              <div>
                <p className="eyebrow">TỔNG QUAN</p>
                <h2 id="stats-title">Thống kê</h2>
              </div>
            </div>
            <div className="stats-grid">
              <Stat label="Số môn" value={visibleStats.count} />
              <Stat label="Tổng tín chỉ" value={visibleStats.credits} />
              <Stat label="GPA (hệ 4)" value={visibleStats.gpa.toFixed(2)} />
              <Stat label="Xếp loại" value={visibleStats.rank} />
              <Stat
                label="GPA tích lũy"
                value={cumulativeStats.gpa.toFixed(2)}
              />
            </div>
          </section>

          <section className="panel" aria-labelledby="courses-title">
            <div className="section-heading course-heading">
              <div>
                <p className="eyebrow">BẢNG ĐIỂM</p>
                <h2 id="courses-title">Môn học</h2>
              </div>
              <label className="semester-filter" htmlFor="semester-filter">
                Xem học kỳ
                <select
                  id="semester-filter"
                  value={semester}
                  onChange={(event) => setSemester(event.target.value)}
                >
                  <option value="all">Tất cả</option>
                  {SEMESTERS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
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
                      <th>
                        <span className="sr-only">Thao tác</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleCourses.map((course) => {
                      const grade = getGrade(course.score);
                      const isFailed = grade.letter === "F";
                      return (
                        <tr
                          key={course.id}
                          className={isFailed ? "failed-course" : ""}
                        >
                          <td data-label="Mã môn">{course.code}</td>
                          <td data-label="Tên môn" className="course-name">
                            {course.name}
                          </td>
                          <td data-label="Tín chỉ">{course.credits}</td>
                          <td data-label="Học kỳ">{course.semester}</td>
                          <td data-label="Điểm hệ 10">
                            <input
                              aria-label={`Điểm ${course.name}`}
                              type="number"
                              min="0"
                              max="10"
                              step="0.1"
                              value={course.score}
                              onChange={(event) => {
                                const score = event.currentTarget.valueAsNumber;
                                if (score >= 0 && score <= 10)
                                  dispatch({
                                    type: "SET_SCORE",
                                    payload: { id: course.id, score },
                                  });
                              }}
                            />
                          </td>
                          <td data-label="Điểm chữ">
                            {isFailed ? "F – Học lại" : grade.letter}
                          </td>
                          <td data-label="Điểm hệ 4">
                            {formatPoint(grade.point)}
                          </td>
                          <td data-label="Xóa">
                            <button
                              className="delete-button"
                              type="button"
                              aria-label={`Xóa ${course.name}`}
                              onClick={() =>
                                dispatch({ type: "REMOVE", payload: course.id })
                              }
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

          <section className="panel" aria-labelledby="add-title">
            <div className="section-heading">
              <div>
                <p className="eyebrow">CẬP NHẬT BẢNG ĐIỂM</p>
                <h2 id="add-title">Thêm môn học</h2>
              </div>
            </div>
            <form className="course-form" onSubmit={handleAddCourse} noValidate>
              <Field label="Mã môn" name="code" error={errors.code}>
                <input
                  ref={codeInputRef}
                  id="course-code"
                  name="code"
                  type="text"
                  value={form.code}
                  onChange={updateForm}
                />
              </Field>
              <Field label="Tên môn" name="name" error={errors.name}>
                <input
                  id="course-name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={updateForm}
                />
              </Field>
              <Field label="Số tín chỉ" name="credits">
                <select
                  id="course-credits"
                  name="credits"
                  value={form.credits}
                  onChange={updateForm}
                >
                  {CREDIT_OPTIONS.map((credits) => (
                    <option key={credits} value={credits}>
                      {credits}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Học kỳ" name="semester">
                <select
                  id="course-semester"
                  name="semester"
                  value={form.semester}
                  onChange={updateForm}
                >
                  {SEMESTERS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Điểm hệ 10" name="score" error={errors.score}>
                <input
                  id="course-score"
                  name="score"
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={form.score}
                  onChange={updateForm}
                />
              </Field>
              <button className="primary-button" type="submit">
                Thêm môn
              </button>
            </form>
          </section>
        </main>
      )}
    </div>
  );
};

const Stat = ({ label, value }) => (
  <div className="stat-card">
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
);

const Field = ({ label, name, error, children }) => (
  <div className="form-field">
    <label htmlFor={`course-${name}`}>{label}</label>
    {children}
    {error && (
      <span className="field-error" role="alert">
        {error}
      </span>
    )}
  </div>
);

export default App;

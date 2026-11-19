import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCourse, selectCourses } from "../features/coursesSlice";
import { CREDIT_OPTIONS, SEMESTERS } from "../data";
import { useNotice } from "../context/NoticeContext";
const initial = {
  code: "",
  name: "",
  credits: "3",
  semester: SEMESTERS[0],
  score: "",
};
export const AddCourseForm = () => {
  const courses = useSelector(selectCourses),
    dispatch = useDispatch(),
    showNotice = useNotice(),
    codeRef = useRef(null);
  const [form, setForm] = useState(initial),
    [errors, setErrors] = useState({});
  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };
  const submit = (e) => {
    e.preventDefault();
    const code = form.code.trim().toUpperCase(),
      score = Number(form.score),
      next = {};
    if (!code) next.code = "Hãy nhập mã môn";
    else if (courses.some((c) => c.code.trim().toUpperCase() === code))
      next.code = "Mã môn đã tồn tại";
    if (!form.name.trim()) next.name = "Hãy nhập tên môn";
    if (form.score === "" || !Number.isFinite(score) || score < 0 || score > 10)
      next.score = "Điểm phải từ 0 đến 10";
    setErrors(next);
    if (Object.keys(next).length) return;
    const name = form.name.trim();
    dispatch(
      addCourse({
        code,
        name,
        credits: Number(form.credits),
        semester: form.semester,
        score,
      }),
    );
    setForm(initial);
    codeRef.current.focus();
    showNotice(`Đã thêm môn ${name}`);
  };
  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">CẬP NHẬT BẢNG ĐIỂM</p>
          <h2>Thêm môn học</h2>
        </div>
      </div>
      <form className="course-form" onSubmit={submit} noValidate>
        {[
          ["code", "Mã môn"],
          ["name", "Tên môn"],
        ].map(([name, label]) => (
          <div className="form-field" key={name}>
            <label htmlFor={`course-${name}`}>{label}</label>
            <input
              ref={name === "code" ? codeRef : null}
              id={`course-${name}`}
              name={name}
              value={form[name]}
              onChange={change}
            />
            {errors[name] && (
              <span role="alert" className="field-error">
                {errors[name]}
              </span>
            )}
          </div>
        ))}
        <div className="form-field">
          <label htmlFor="course-credits">Số tín chỉ</label>
          <select
            id="course-credits"
            name="credits"
            value={form.credits}
            onChange={change}
          >
            {CREDIT_OPTIONS.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="course-semester">Học kỳ</label>
          <select
            id="course-semester"
            name="semester"
            value={form.semester}
            onChange={change}
          >
            {SEMESTERS.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="course-score">Điểm hệ 10</label>
          <input
            id="course-score"
            name="score"
            type="number"
            min="0"
            max="10"
            step="0.1"
            value={form.score}
            onChange={change}
          />
          {errors.score && (
            <span role="alert" className="field-error">
              {errors.score}
            </span>
          )}
        </div>
        <button className="primary-button">Thêm môn</button>
      </form>
    </section>
  );
};

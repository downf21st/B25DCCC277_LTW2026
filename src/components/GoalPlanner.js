import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCourses } from "../features/coursesSlice";
import { setTarget, setRemaining } from "../features/goalSlice";
import { calcStats } from "../utils";
export const GoalPlanner = () => {
  const courses = useSelector(selectCourses),
    { target, remaining } = useSelector((s) => s.goal),
    dispatch = useDispatch();
  const result = useMemo(() => {
    const t = Number(target),
      r = Number(remaining),
      stats = calcStats(courses);
    if (
      target === "" ||
      remaining === "" ||
      !Number.isFinite(t) ||
      t < 0 ||
      t > 4 ||
      !Number.isInteger(r) ||
      r < 1
    )
      return "Hãy nhập GPA mục tiêu (0–4) và số tín chỉ còn lại (từ 1)";
    const need = (t * (stats.credits + r) - stats.points) / r;
    if (need > 4) return "Không thể đạt mục tiêu này";
    if (need >= 0) return "Bạn đã đạt mục tiêu";
    return `Cần đạt trung bình ${need.toFixed(2)} điểm (hệ 4) ở ${r} tín chỉ còn lại`;
  }, [courses, target, remaining]);
  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">KẾ HOẠCH HỌC TẬP</p>
          <h2>Mục tiêu GPA</h2>
        </div>
      </div>
      <div className="goal-fields">
        <label>
          GPA mục tiêu
          <input
            type="number"
            min="0"
            max="4"
            step="0.01"
            value={target}
            onChange={(e) => dispatch(setTarget(e.target.value))}
          />
        </label>
        <label>
          Số tín chỉ còn lại
          <input
            type="number"
            value={remaining}
            onChange={(e) => dispatch(setRemaining(e.target.value))}
          />
        </label>
      </div>
      <p className="goal-result">{result}</p>
    </section>
  );
};


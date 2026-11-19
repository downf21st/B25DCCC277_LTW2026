import { memo, useRef } from "react";
import { formatPoint } from "../data";
import { getGrade } from "../utils";
const CourseRow = memo(({ course, onScore, onRemove }) => {
  const renders = useRef(0);
  renders.current += 1;
  const grade = getGrade(course.score),
    failed = grade.letter === "F";
  return (
    <tr className={failed ? "failed-course" : ""}>
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
            if (score >= 0 && score <= 10) onScore(course.id, score);
          }}
        />
      </td>
      <td>{failed ? "F – Học lại" : grade.letter}</td>
      <td>{formatPoint(grade.point)}</td>
      <td>{renders.current}</td>
      <td>
        <button
          className="delete-button"
          aria-label={`Xóa ${course.name}`}
          onClick={() => onRemove(course)}
        >
          Xóa
        </button>
      </td>
    </tr>
  );
});
export default CourseRow;

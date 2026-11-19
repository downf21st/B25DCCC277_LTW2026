import { GRADES, RANKS } from "./data";

export const getGrade = (score) =>
  GRADES.find((grade) => score >= grade.min) ?? GRADES[GRADES.length - 1];

export const getRank = (gpa) =>
  RANKS.find((rank) => gpa >= rank.min)?.title ?? "Chưa xếp loại";

export const calcStats = (courses) => {
  const totals = courses.reduce(
    (result, course) => {
      const grade = getGrade(course.score);
      result.credits += Number(course.credits);
      result.points += Number(course.credits) * grade.point;
      return result;
    },
    { credits: 0, points: 0 },
  );
  const rawGpa = totals.credits ? totals.points / totals.credits : 0;
  const gpa = Math.round(rawGpa * 100) / 100;
  return {
    count: courses.length,
    credits: totals.credits,
    points: totals.points,
    gpa,
    rank: courses.length ? getRank(gpa) : "Chưa xếp loại",
  };
};

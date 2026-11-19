import { createSelector } from "@reduxjs/toolkit";
import { selectCourses } from "./coursesSlice";
import { calcStats } from "../utils";
export const selectSemesterCourses = createSelector(
  [selectCourses, (_state, semester) => semester],
  (courses, semester) =>
    semester === "all"
      ? courses
      : courses.filter((course) => course.semester === semester),
);
export const selectSemesterStats = createSelector(
  [selectSemesterCourses],
  calcStats,
);
export const selectCumulativeStats = createSelector([selectCourses], calcStats);

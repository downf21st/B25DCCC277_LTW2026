import { configureStore } from "@reduxjs/toolkit";
import courses from "./features/coursesSlice";
import goal from "./features/goalSlice";
import undo from "./features/undoSlice";
import { loadSaved, saveCourses } from "./storage";
const savedCourses = loadSaved();
export const hasSaved = savedCourses !== null;
export const store = configureStore({
  reducer: { courses, goal, undo },
  preloadedState: { courses: savedCourses ?? [], goal: undefined },
});
let previousCourses = store.getState().courses;
store.subscribe(() => {
  const currentCourses = store.getState().courses;
  if (currentCourses !== previousCourses) {
    saveCourses(currentCourses);
    previousCourses = currentCourses;
  }
});

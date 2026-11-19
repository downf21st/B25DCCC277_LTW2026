import { createSlice } from "@reduxjs/toolkit";
const coursesSlice = createSlice({
  name: "courses",
  initialState: [],
  reducers: {
    setCourses: (_state, action) => [...action.payload],
    addCourse: (state, action) => {
      const id = state.reduce((max, course) => Math.max(max, course.id), 0) + 1;
      state.push({ ...action.payload, id });
    },
    removeCourse: (state, action) =>
      state.filter((course) => course.id !== action.payload),
    restoreCourse: (state, action) => {
      state.push(action.payload);
    },
    setScore: (state, action) => {
      const course = state.find((item) => item.id === action.payload.id);
      if (course) course.score = action.payload.score;
    },
  },
});
export const { setCourses, addCourse, removeCourse, setScore, restoreCourse } =
  coursesSlice.actions;
export const selectCourses = (state) => state.courses;
export default coursesSlice.reducer;

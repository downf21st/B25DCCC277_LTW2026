import { configureStore } from "@reduxjs/toolkit";
import courses from "./features/coursesSlice";
import goal from "./features/goalSlice";
export const store = configureStore({ reducer: { courses, goal } });

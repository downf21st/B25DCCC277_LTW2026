export const coursesReducer = (state, action) => {
  switch (action.type) {
    case "LOAD":
      return [...action.payload];
    case "ADD": {
      const nextId =
        state.reduce((maxId, course) => Math.max(maxId, course.id), 0) + 1;
      return [...state, { ...action.payload, id: nextId }];
    }
    case "REMOVE":
      return state.filter((course) => course.id !== action.payload);
    case "SET_SCORE":
      return state.map((course) =>
        course.id === action.payload.id
          ? { ...course, score: action.payload.score }
          : course,
      );
    default:
      return state;
  }
};

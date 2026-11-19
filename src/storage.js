const COURSES_KEY = "ltw_sodiem_courses";
export const loadSaved = () => {
  try {
    const value = localStorage.getItem(COURSES_KEY);
    if (value === null) return null;
    const courses = JSON.parse(value);
    return Array.isArray(courses) ? courses : null;
  } catch {
    return null;
  }
};
export const saveCourses = (courses) => {
  try {
    localStorage.setItem(COURSES_KEY, JSON.stringify(courses));
  } catch {}
};

import { NavLink } from "react-router-dom";
function NavBar() {
  return (
    <nav>
      <NavLink to="/" end>
        Trang chủ
      </NavLink>{" "}
      <NavLink to="/questions">Ngân hàng câu hỏi</NavLink>{" "}
      <NavLink to="/history">Lịch sử</NavLink>
    </nav>
  );
}

export default NavBar;

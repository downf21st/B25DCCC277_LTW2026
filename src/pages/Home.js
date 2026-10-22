import { useNavigate } from "react-router-dom";
import { formatMoney } from "../data";

const Home = ({ playerName, setPlayerName, history }) => {
  const navigate = useNavigate();
  const best = history.reduce(
    (top, h) => (top === null || h.prize > top.prize ? h : top),
    null,
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (playerName.trim() === "") return;
    navigate("/play");
  };

  return (
    <div>
      <h1>Ai là triệu phú</h1>
      {best && <p>{`Kỷ lục: ${formatMoney(best.prize)} – ${best.name}`}</p>}
      <h3>Luật chơi</h3>
      <ul>
        <li>
          15 câu hỏi trắc nghiệm về HTML, CSS, ES6, React; mỗi câu có 30 giây.
        </li>
        <li>
          Trả lời đúng thì lên bậc tiền thưởng tiếp theo, câu 15 trị giá
          250.000.000 đ.
        </li>
        <li>Câu 5, 10, 15 là các mốc an toàn.</li>
        <li>
          Trả lời sai hoặc hết giờ chỉ nhận tiền của mốc cao nhất đã vượt qua.
        </li>
      </ul>
      <form onSubmit={handleSubmit}>
        <label>
          Tên người chơi:{" "}
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Nhập tên của bạn"
          />
        </label>{" "}
        <button type="submit" disabled={playerName.trim() === ""}>
          Bắt đầu
        </button>
      </form>
    </div>
  );
};

export default Home;

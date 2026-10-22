import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import App from "./App";

jest.mock("axios", () => ({
  get: jest.fn(),
  isCancel: jest.fn(),
}));

const questions = [
  {
    id: 1,
    level: 1,
    question: "Thẻ HTML nào dùng để tạo một liên kết (hyperlink)?",
    options: ["<link>", "<a>", "<href>", "<nav>"],
    answer: 1,
  },
];

beforeEach(() => {
  axios.get.mockResolvedValue({ data: questions });
});

test("shows the home page and starts a game with the loaded questions", async () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );

  expect(
    screen.getByRole("heading", { name: "Ai là triệu phú" }),
  ).toBeInTheDocument();

  fireEvent.change(screen.getByPlaceholderText("Nhập tên của bạn"), {
    target: { value: "Lan" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Bắt đầu" }));

  await waitFor(() => {
    expect(screen.getByText(questions[0].question)).toBeInTheDocument();
  });
  expect(axios.get).toHaveBeenCalledWith(
    "/data/question.json",
    expect.objectContaining({ signal: expect.any(AbortSignal) }),
  );
});

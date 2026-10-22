import { PRIZES, MILESTONES } from "./data";

export const calcPrize = (correctCount, reason) => {
  if (reason === "win") return PRIZES[PRIZES.length - 1];
  if (reason === "stop") return correctCount > 0 ? PRIZES[correctCount - 1] : 0;

  const passed = MILESTONES.filter((m) => m <= correctCount);
  if (passed.length === 0) return 0;
  return PRIZES[Math.max(...passed) - 1];
};

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const pickFiftyFifty = (answer) =>
  shuffle([0, 1, 2, 3].filter((i) => i !== answer)).slice(0, 2);

export const audienceVotes = (answer, hidden) => {
  const wrongs = [0, 1, 2, 3].filter(
    (i) => i !== answer && !hidden.includes(i),
  );
  let result = [0, 0, 0, 0];
  for (let attempt = 0; attempt < 50; attempt++) {
    const correct = 40 + Math.floor(Math.random() * 31);
    const rest = 100 - correct;
    const weights = wrongs.map(() => Math.random() + 0.1);
    const sum = weights.reduce((a, b) => a + b, 0);
    const shares = weights.map((w) => Math.floor((rest * w) / sum));
    const diff = rest - shares.reduce((a, b) => a + b, 0);
    shares[shares.length - 1] += diff;
    result = [0, 0, 0, 0];
    result[answer] = correct;
    for (let k = 0; k < wrongs.length; k++) {
      result[wrongs[k]] = shares[k];
    }
    if (Math.max(...shares) < correct) break;
  }
  return result;
};

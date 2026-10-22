import { PRIZES, MILESTONES, formatMoney } from "../data";

const MoneyLadder = ({ current }) => {
  const steps = PRIZES.map((prize, i) => ({ prize, step: i + 1 })).reverse();
  return (
    <ul className="ladder">
      {steps.map(({ prize, step }) => {
        let cls = "ladder-item";
        if (step === current) cls += " active";
        if (MILESTONES.includes(step)) cls += " milestone";
        return (
          <li key={step} className={cls}>
            {`${step}. ${formatMoney(prize)}`}
          </li>
        );
      })}
    </ul>
  );
};

export default MoneyLadder;

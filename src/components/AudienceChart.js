import { LETTERS } from "../data";

const AudienceChart = ({ data }) => (
  <div className="audience-chart">
    {data.map((percent, i) => (
      <div key={i} className="audience-bar" style={{ width: `${percent}%` }}>
        {`${LETTERS[i]}: ${percent}%`}
      </div>
    ))}
  </div>
);

export default AudienceChart;

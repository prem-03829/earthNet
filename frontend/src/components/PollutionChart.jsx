import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

function PollutionChart({ data }) {

  return (
    <LineChart width={600} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />

      <XAxis dataKey="city" />
      <YAxis />

      <Tooltip />
      <Legend />

      <Line type="monotone" dataKey="pollution" stroke="#ff0000" />
    </LineChart>
  );
}

export default PollutionChart;
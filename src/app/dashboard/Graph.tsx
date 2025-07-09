'use client';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface GraphProps {
  xMax: Date;
  xMin: Date;
  dataset: string;
  historyData: {
    date: Date;
    asset: number;
    liability: number;
  }[];
}

const Graph = (prop: GraphProps) => {
  return (
    <div className="w-full h-96 p-4 bg-white">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={prop.historyData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#eeeeee" />
          <XAxis
            dataKey="date"
            type="number"
            axisLine={false}
            tickLine={false}
            domain={[prop.xMin.getTime(), prop.xMax.getTime()]}
            allowDataOverflow={true}
            tick={{ fontSize: 12, fill: '#666' }}
            tickFormatter={(timestamp) =>
              new Date(timestamp).toLocaleDateString()
            }
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#666' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          <Legend />
          {prop.dataset === 'all' ? (
            <>
              <NetworthDataset />
              <AssetDataset />
              <LiabilityDataset />
            </>
          ) : prop.dataset === 'networth' ? (
            <NetworthDataset />
          ) : prop.dataset === 'asset' ? (
            <AssetDataset />
          ) : (
            <LiabilityDataset />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const NetworthDataset = () => (
  <Line
    type="monotone"
    dataKey="networth"
    stroke="#2563EB"
    strokeWidth={2}
    dot={false}
    name="Networth"
  />
);

const AssetDataset = () => (
  <Line
    type="monotone"
    dataKey="asset"
    stroke="#16A34A"
    strokeWidth={2}
    dot={false}
    name="Assets"
  />
);

const LiabilityDataset = () => (
  <Line
    type="monotone"
    dataKey="liability"
    stroke="#EA580C"
    strokeWidth={2}
    dot={false}
    name="Liabilities"
  />
);

export default Graph;

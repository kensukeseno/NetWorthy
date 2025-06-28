'use client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data
const data = [
  { month: 'Sep', blue: 1000, orange: 2000, green: 2500 },
  { month: 'Oct', blue: 1200, orange: 2100, green: 2300 },
  { month: 'Nov', blue: 1400, orange: 1800, green: 2100 },
  { month: 'Dec', blue: 1600, orange: 1500, green: 1900 },
  { month: 'Jan', blue: 1800, orange: 2200, green: 2700 },
  { month: 'Feb', blue: 2000, orange: 2800, green: 2400 },
  { month: 'Mar', blue: 2200, orange: 2600, green: 2200 },
  { month: 'Apr', blue: 2400, orange: 2400, green: 2600 },
  { month: 'May', blue: 2600, orange: 2000, green: 2800 },
  { month: 'Jun', blue: 2800, orange: 2300, green: 2500 },
  { month: 'Jul', blue: 3000, orange: 2600, green: 2300 },
  { month: 'Aug', blue: 3200, orange: 2900, green: 3100 }
];

const Graph = () => {
  return (
    <div className="w-full h-96 p-4 bg-white">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#eeeeee" />
          <XAxis 
            dataKey="month" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#666' }}
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
              borderRadius: '4px'
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="blue" 
            stroke="#4285f4" 
            strokeWidth={2}
            dot={false}
            name="Asset 1"
          />
          <Line 
            type="monotone" 
            dataKey="orange" 
            stroke="#ff6b35" 
            strokeWidth={2}
            dot={false}
            name="Asset 2"
          />
          <Line 
            type="monotone" 
            dataKey="green" 
            stroke="#4caf50" 
            strokeWidth={2}
            dot={false}
            name="Asset 3"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Graph;
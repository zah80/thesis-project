import React, { useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faUsers, faTasks, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip as ChartTooltip, Legend } from 'chart.js';
import './overView.css'; // Ensure the correct path to your CSS file

// Register necessary components for Chart.js
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, ChartTooltip, Legend);

const salesData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Sales',
      data: [16, 14, 10, 8, 6, 4, 5, 8, 10, 15, 16, 20],
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderWidth: 1,
    },
  ],
};

const trafficData = [
  { name: 'Desktop', value: 63, color: '#8884d8' },
  { name: 'Tablet', value: 15, color: '#82ca9d' },
  { name: 'Phone', value: 22, color: '#ffc658' },
];

const OverView = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    // Cleanup function to destroy the chart instance if it exists
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="overview">
      <div className="overview-cards">
        <div className="overview-card">
          <h2>Budget</h2>
          <p>$24k</p>
          <span>↑ 12% Since last month</span>
          <FontAwesomeIcon icon={faDollarSign} size="2x" />
        </div>
        <div className="overview-card">
          <h2>Total Customers</h2>
          <p>1.6k</p>
          <span>↓ 16% Since last month</span>
          <FontAwesomeIcon icon={faUsers} size="2x" />
        </div>
        <div className="overview-card">
          <h2>Task Progress</h2>
          <p>75.5%</p>
          <FontAwesomeIcon icon={faTasks} size="2x" />
        </div>
        <div className="overview-card">
          <h2>Total Profit</h2>
          <p>$15k</p>
          <FontAwesomeIcon icon={faChartLine} size="2x" />
        </div>
      </div>

      <div className="sales-traffic">
        <div className="sales">
          <h2>Sales</h2>
          <ResponsiveContainer width="100%" height={300}>
            <Line ref={chartRef} data={salesData} options={{ maintainAspectRatio: false }} />
          </ResponsiveContainer>
        </div>
        <div className="traffic">
          <h2>Traffic Source</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie dataKey="value" data={trafficData} outerRadius={80} label>
                {trafficData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default OverView;

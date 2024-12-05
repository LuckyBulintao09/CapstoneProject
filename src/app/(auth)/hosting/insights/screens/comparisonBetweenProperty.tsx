"use client";
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2'; 
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

// Registering necessary chart elements
ChartJS.register(LineElement, CategoryScale, LinearScale, Tooltip, Legend);

import getPropertyComparison from '@/actions/analytics/propertyComparison';

function ComparisonBetweenProperty({ dateRange }: { dateRange?: any }) {
  const [data, setData] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); 

  useEffect(() => {
    if (dateRange) {
      fetchData(dateRange); 
    }
  }, [dateRange]); 

  const fetchData = async (dateRange?: any) => {
    if (dateRange) {
      try {
        setLoading(true);
        setError(null); 
        const fetchedData = await getPropertyComparison(dateRange);
        setData(fetchedData); 
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data'); 
      } finally {
        setLoading(false); 
      }
    }
  };

  const processData = () => {
    if (!data) return null;

    
    const groupedData = data.reduce((acc, item) => {
      const { propertyTitle, date } = item;
      const month = new Date(date).toLocaleString('default', { month: 'short' }); 
      if (!acc[propertyTitle]) {
        acc[propertyTitle] = Array(12).fill(0); 
      }

      const monthIndex = new Date(date).getMonth(); 
      acc[propertyTitle][monthIndex] += 1;

      return acc;
    }, {});

    return groupedData;
  };

  const chartData = () => {
    const groupedData = processData();
    if (!groupedData) return null;

    const labels = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const datasets = Object.keys(groupedData).map(propertyTitle => ({
      label: propertyTitle,
      data: groupedData[propertyTitle],
      fill: false,
      borderColor: '#'+(Math.random()*0xFFFFFF<<0).toString(16), 
      tension: 0.1,
    }));

    return {
      labels: labels,
      datasets: datasets,
    };
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div>
      {loading ? (
        <p>Generating chart...</p> 
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div>
          {data ? (
            <Line data={chartData()} options={options} />
          ) : (
            <p>No data available</p>
          )}
        </div>
      )}
    </div>
  );
}

export default ComparisonBetweenProperty;

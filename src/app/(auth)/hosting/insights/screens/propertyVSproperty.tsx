"use client";

import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import getPropertyVSPropertyAnalytics from "@/actions/analytics/propertyVSpropertyAnalytics";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import chroma from "chroma-js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function PropertyVSProperty() {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const analyticsData = await getPropertyVSPropertyAnalytics();
        const groupedData: { [key: string]: { [key: string]: number } } = {};

        analyticsData.forEach((entry: any) => {
          const { title, created_at } = entry;
          const date = new Date(created_at);
          const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;

          if (!groupedData[title]) {
            groupedData[title] = {};
          }

          if (!groupedData[title][monthYear]) {
            groupedData[title][monthYear] = 0;
          }

          groupedData[title][monthYear]++;
        });

        const labels = Object.keys(groupedData[Object.keys(groupedData)[0]]);
        
        const numProperties = Object.keys(groupedData).length;
        const colorScale = chroma.scale('Set3').mode('lab').colors(numProperties);

        const datasets = Object.keys(groupedData).map((title, index) => {
          const data = labels.map((month) => groupedData[title][month] || 0);

          return {
            label: title,
            data,
            fill: false,
            borderColor: colorScale[index],
            tension: 0.4,
          };
        });

        setChartData({
          labels,
          datasets,
        });
      } catch (error) {
        console.error("Error fetching analytics data:", error.message);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div>
      <h2>Property VS Property Analytics</h2>
      {chartData ? (
        <Line
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "top" },
              title: { display: true, text: "Property Analytics Comparison" },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Month/Year",
                },
              },
              y: {
                title: {
                  display: true,
                  text: "Property Visits",
                },
                ticks: {
                  beginAtZero: true,
                },
              },
            },
          }}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default PropertyVSProperty;

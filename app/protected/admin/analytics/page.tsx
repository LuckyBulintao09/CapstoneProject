"use client";

import { useEffect, useState } from "react";
import { deleteDataOlderThanTwoMonths, getAllAnalytics } from "@/app/actions/analytics/getAllAnalytics";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Spinner } from "@nextui-org/spinner";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const AnalyticsChart = () => {
  const [chartData, setChartData] = useState<{ labels: string[]; data: number[] }>({
    labels: [],
    data: [],
  });
  const [period, setPeriod] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await deleteDataOlderThanTwoMonths();
        const analytics = await getAllAnalytics(period);
  
        if (!analytics || analytics.length === 0) {

          setChartData({ labels: [], data: [] });
          return; 
        }
  
        const labels = analytics.map((item) => item.title);
        const data = analytics.map((item) => item.count);
        setChartData({ labels, data });
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [period]);
  

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: "Download count",
        data: chartData.data,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const isSelected = (buttonPeriod: string) => buttonPeriod === period;

  return (
    <><div className="m-2">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/protected/admin/dashboard">Admin</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Analytics</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div><div className="h-screen flex flex-col items-center justify-center p-6 ">
        <h2 className="text-xl font-semibold mb-4">Download Analytics</h2>
        {loading ? (
          <div className="text-center flex flex-col items-center">
            <Spinner />
            <span>Generating chart...</span>
          </div>
        ) : (
          <div className="w-full md:w-4/5 lg:w-3/4 xl:w-2/3 2xl:w-3/4 m-4 p-6 border">

            <Bar
              data={data}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: true },
                  datalabels: {
                    display: true,
                    color: "black",
                    font: {
                      weight: "bold" as const,
                    },
                    formatter: (value: number) => value.toString(),
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    type: "linear",
                  },
                },
              }} />
          </div>
        )}
        <small className="text-xs text-gray-500 mb-2">*Data is retained for a maximum of 2 months. Any data exceeding this period will be automatically deleted to optimize storage usage.</small>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => setPeriod("all")}
            className={`px-4 py-2 rounded ${isSelected("all") ? "bg-gray-700" : "bg-gray-300"} text-white`}
          >
            All Time
          </button>
          <button
            onClick={() => setPeriod("24h")}
            className={`px-4 py-2 rounded ${isSelected("24h") ? "bg-gray-700" : "bg-gray-300"} text-white`}
          >
            Last 24 Hours
          </button>
          <button
            onClick={() => setPeriod("7d")}
            className={`px-4 py-2 rounded ${isSelected("7d") ? "bg-gray-700" : "bg-gray-300"} text-white`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setPeriod("30d")}
            className={`px-4 py-2 rounded ${isSelected("30d") ? "bg-gray-700" : "bg-gray-300"} text-white`}
          >
            Last 30 Days
          </button>
        </div>
      </div></>
  );
};

export default AnalyticsChart;


"use client";
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';

ChartJS.register(LineElement, CategoryScale, LinearScale, Tooltip, Legend);

import getPropertyComparison from '@/actions/analytics/propertyComparison';
import { fetchUserProperties } from '@/actions/analytics/fetchUserProperties';

function ComparisonBetweenProperty() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<string>('default');
  const [properties, setProperties] = useState<string[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);

  useEffect(() => {
    if (dateRange !== 'default' && selectedProperty) {
      fetchData(dateRange, selectedProperty);
    }
  }, [dateRange, selectedProperty]);

  const fetchData = async (selectedDateRange: string, property: string) => {
    try {
      setLoading(true);
      setError(null);
      const fetchedData = await getPropertyComparison(
        selectedDateRange === 'All Time' ? 'all_time' : selectedDateRange,
        property
      );
      setData(fetchedData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchProperties = async () => {
    try {
      const fetchedProperties = await fetchUserProperties();
      setProperties(fetchedProperties);
    } catch (error) {
      console.error('Error fetching user properties:', error);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

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
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];

    const datasets = Object.keys(groupedData).map((propertyTitle) => ({
      label: propertyTitle,
      data: groupedData[propertyTitle],
      fill: false,
      borderColor: '#' + (Math.random() * 0xffffff << 0).toString(16),
      tension: 0.1,
    }));

    return {
      labels: labels,
      datasets: datasets,
    };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
    <div className="w-full p-4">
      <p className="text-base text-left dark:text-white mt-4">
        {selectedProperty && selectedProperty !== 'all_properties'
          ? `Reservation Analytics for ${selectedProperty}`
          : selectedProperty === 'all_properties'
          ? 'Reservation Comparison Across All Properties'
          : 'Property Reservation Analytics'}
      </p>

      <div className="flex flex-col sm:flex-row gap-4 my-4">
        <div className="flex-1">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-full sm:w-64 border-gray-300 dark:text-gray-300 bg-transparent rounded-md text-sm focus:ring-offset-0 focus:ring-0">
              <SelectValue placeholder="Select Date Range" />
            </SelectTrigger>
            <SelectContent className="text-sm bg-white dark:bg-secondary">
              <SelectItem value="All Time">All Time</SelectItem>
              <SelectItem value="Last 24 hours">Last 24 hours</SelectItem>
              <SelectItem value="Last 7 days">Last 7 days</SelectItem>
              <SelectItem value="Last 4 weeks">Last 4 weeks</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <Select value={selectedProperty || ''} onValueChange={setSelectedProperty}>
            <SelectTrigger className="w-full sm:w-64 border-gray-300 dark:text-gray-300 bg-transparent rounded-md text-sm focus:ring-offset-0 focus:ring-0">
              <SelectValue placeholder="Select Property" />
            </SelectTrigger>
            <SelectContent className="text-sm bg-white dark:bg-secondary">
              <SelectItem value="all_properties">All Properties</SelectItem>
              {properties.length > 0 ? (
                properties.map((property, index) => (
                  <SelectItem key={index} value={property}>
                    {property}
                  </SelectItem>
                ))
              ) : (
                <SelectItem disabled>Loading properties...</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <p>Generating chart...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="h-64 sm:h-96">
          {data ? (
            <Line data={chartData()} options={options} />
          ) : (
            <p className="text-gray-500">Select a date range and property to generate a chart.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default ComparisonBetweenProperty;

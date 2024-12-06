"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { fetchUserProperties } from '@/actions/analytics/fetchUserProperties';
import { getCompanyAnalytics } from '@/actions/analytics/getCompanyAnalytics';
import { toast } from 'sonner';
import { getReservationAnalytics } from '@/actions/analytics/getTotalReservation';
import getPropertyComparison from '@/actions/analytics/propertyComparison';
import ComparisonBetweenProperty from './comparisonBetweenProperty';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  LineElement,
  PointElement
);

const ReservationsAnalytics = () => {
  const [selectedProperty, setSelectedProperty] = useState('default');
  const [properties, setProperties] = useState([]); 
  const [date, setDate] = useState('default'); 
  const [companyAnalyticsData, setCompanyAnalyticsData] = useState(null); 
  const [reservationAnalyticsData, setReservationAnalyticsData] = useState(null); 
  const [loading, setLoading] = useState(false); 
  const [isAnalyticsFetched, setIsAnalyticsFetched] = useState(false);

  const fetchAnalytics = async () => {
    if (date === 'default' || selectedProperty === 'default') {
      toast.error('Please select property and a date range');
      return;
    }

    setLoading(true); 

    try {
      const companyAnalytics = await getCompanyAnalytics(date === 'All Time' ? 'all_time' : date);
      const reservationComparison = await getPropertyComparison(date);
      const reservationAnalytics = await getReservationAnalytics(
        selectedProperty,
        date === 'All Time' ? 'all_time' : date
      );
      
      setCompanyAnalyticsData(companyAnalytics); 
      setReservationAnalyticsData(reservationAnalytics); 
      setIsAnalyticsFetched(true); 

    } catch (error) {
      console.error('Error fetching analytics:', error.message);
      toast.error('Failed to fetch analytics');
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedProperties = await fetchUserProperties();
        setProperties(fetchedProperties); 
      } catch (error) {
        console.error('Error fetching user properties:', error.message);
      }
    };

    fetchData();
  }, []); 

  useEffect(() => {
    if (selectedProperty !== 'default' && date !== 'default') {
      fetchAnalytics(); 
    }
  }, [selectedProperty, date]); 

  const data = {
    labels: ['On-Site Reservations', 'Room Reservations'],
    datasets: [
      {
        label: 'Reservations',
        data: reservationAnalyticsData ? [reservationAnalyticsData.onSiteVisitsCount, reservationAnalyticsData.roomReservationsCount] : [0, 0], 
        backgroundColor: ['#4CAF50', '#2196F3'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    scales: {
      x: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <>
      <div className="mb-4 flex items-center space-x-4">
        {/* Property Selector */}
        <Select value={selectedProperty || ''} onValueChange={setSelectedProperty}>
          <SelectTrigger
            id="property-selector"
            className="border-gray-300 dark:text-gray-300 bg-transparent w-48 rounded-md text-sm text-gray-700 focus:ring-offset-0 focus:ring-0 hover:font-semibold transition-all duration-300"
          >
            <SelectValue placeholder="Select Property" />
          </SelectTrigger>
          <SelectContent position="popper" className="text-sm bg-white dark:bg-secondary border-gray-300">
            {properties.length > 0 ? (
              properties.map((property, index) => (
                <SelectItem key={index} value={property} className="text-sm">
                  {property}
                </SelectItem>
              ))
            ) : (
              <SelectItem disabled className="text-sm">
                Loading properties...
              </SelectItem>
            )}
          </SelectContent>
        </Select>

        {/* Date Range Selector */}
        <Select value={date} onValueChange={setDate}>
          <SelectTrigger
            id="date-selector"
            className="border-gray-300 dark:text-gray-300 bg-transparent w-48 rounded-md text-sm text-gray-700 focus:ring-offset-0 focus:ring-0 hover:font-semibold transition-all duration-300"
          >
            <SelectValue placeholder="Select Date Range" />
          </SelectTrigger>
          <SelectContent position="popper" className="text-sm bg-white dark:bg-secondary border-gray-300">
            <SelectItem value="All Time" className="text-sm">
              All Time
            </SelectItem>
            <SelectItem value="Last 24 hours" className="text-sm">
              Last 24 hours
            </SelectItem>
            <SelectItem value="Last 7 days" className="text-sm">
              Last 7 days
            </SelectItem>
            <SelectItem value="Last 4 weeks" className="text-sm">
              Last 4 weeks
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-10 gap-0 xl:gap-4">
        <div className="col-span-4 grid grid-rows-3 gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-white dark:bg-secondary rounded-lg border-gray-300">
              <p className="p-4 text-xs text-gray-500 dark:text-gray-300">Total Reservations</p>
              <CardHeader className="p-1 flex justify-center items-center text-center">
                <CardTitle className="text-4xl font-bold">
                 
                  {loading ?  <p className='text-xs pb-4'>Recalculating...</p> : (reservationAnalyticsData?.count || 'no data')}

             
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="bg-white dark:bg-secondary rounded-lg border-gray-300">
              <p className="p-4 text-xs text-gray-500 dark:text-gray-300">Total Company Page Visits</p>
              <CardHeader className="p-1 flex justify-center items-center text-center">
                <CardTitle className="text-4xl font-bold">
                  {loading ? <p className='text-xs pb-4'>Recalculating...</p> : (companyAnalyticsData?.count || 'no data')}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
          <div className="row-span-2 rounded-lg">
            <Card className="bg-white dark:bg-secondary rounded-lg border-gray-300 row-span-2 mb-4 xl:mb-0">
              <p className="p-4 text-xs text-gray-500 dark:text-gray-300">On-Site vs Room Reservations</p>
              <CardContent>
                {loading ? <p className='text-xs pb-4'>Recalculating...</p> : <Bar data={data} />}
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="col-span-6 rounded-lg">
          <Card className="bg-white dark:bg-secondary rounded-lg border-gray-300 h-[470px] justify-center h-full">
            <p className="p-4 text-m text-gray-500 dark:text-gray-300">Total Reservations Across All Properties</p>

            <CardContent className='w-full bg-transparent'>
              {loading ? <p className='text-xs pb-4'>Recalculating...</p> : (isAnalyticsFetched && <ComparisonBetweenProperty dateRange={date} />)}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ReservationsAnalytics;

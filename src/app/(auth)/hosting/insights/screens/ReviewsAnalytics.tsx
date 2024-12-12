'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { fetchUserProperties } from '@/actions/analytics/fetchUserProperties';
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { PolarArea } from 'react-chartjs-2';
import { LucideStar, MessageSquare } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Reviews from './reviews';
import { getReviewAnalytics } from '@/actions/analytics/getReviewAnalytics';
import { toast } from 'sonner';

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

const ReviewsAnalytics = () => {
 
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState('default');
  const [timePeriod, setTimePeriod] = useState('allTime');
  const [loading, setLoading] = useState(false);
  const [reviewData, setReviewData] = useState(null);


  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const data = await fetchUserProperties();
        console.log('Fetched properties:', data);
        setProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);


  useEffect(() => {
    if (selectedProperty === 'default' || timePeriod === 'default') {
      setReviewData(null); 
      return;
    }

    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const data = await getReviewAnalytics(selectedProperty, timePeriod);
        setReviewData(data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [selectedProperty, timePeriod]);

  const data = {
    labels: ['Cleanliness', 'Location', 'Value for Money'],
    datasets: [
      {
        label: 'Review Ratings',
        data: [
          reviewData?.cleanliness || 0,
          reviewData?.location || 0,
          reviewData?.value_for_money || 0,
        ], 
        backgroundColor: [
          'rgba(54, 162, 235, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(255, 206, 86, 0.5)',
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 1,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <>
      <div className='mb-4 flex items-center space-x-4'>
        <Select value={selectedProperty} onValueChange={setSelectedProperty}>
          <SelectTrigger
            id='property-selector'
            className='border-gray-300 dark:text-gray-300 bg-transparent w-48 rounded-md text-sm text-gray-700 focus:ring-offset-0 focus:ring-0 hover:font-semibold transition-all duration-300'
          >
            <SelectValue placeholder='Select Property' />
          </SelectTrigger>
          <SelectContent
            position='popper'
            className='text-sm bg-white dark:bg-secondary border-gray-300'
          >
            {properties.map((property, index) => (
              <SelectItem key={index} value={property}>
                {property}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={timePeriod} onValueChange={setTimePeriod}>
          <SelectTrigger
            className='border-gray-300 dark:text-gray-300 bg-transparent w-48 rounded-md text-sm text-gray-700 focus:ring-offset-0 focus:ring-0 hover:font-semibold transition-all duration-300'
          >
            <SelectValue placeholder='Select Time Period' />
          </SelectTrigger>
          <SelectContent
            position='popper'
            className='text-sm bg-white dark:bg-secondary border-gray-300'
          >
            <SelectItem value='allTime'>All Time</SelectItem>
            <SelectItem value='last24hrs'>Last 24 hours</SelectItem>
            <SelectItem value='last7days'>Last 7 days</SelectItem>
            <SelectItem value='last4weeks'>Last 4 weeks</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className='flex justify-center items-center h-64'>
          <p className='text-gray-500 dark:text-gray-300'>Calculating...</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 xl:grid-cols-2 gap-4 pb-14'>
          <Card className='bg-white dark:bg-secondary rounded-lg border-gray-300'>
            <p className='p-4 text-xs text-gray-500 dark:text-gray-300'>
              Overall Review Ratings
            </p>
            <CardContent className='flex justify-center items-center'>
              <div style={{ width: '400px', height: '400px' }}>
                <PolarArea data={data} options={options} />
              </div>
            </CardContent>
          </Card>

          <div className='grid grid-rows-3 gap-4'>
            <Card className='bg-white dark:bg-secondary rounded-lg border-gray-300'>
              <p className='p-4 text-xs text-gray-500 dark:text-gray-300'>
                Overall Rating and Reviews
              </p>
              <CardContent className='grid grid-cols-2 pt-3'>
                <div className='flex flex-col items-center justify-center text-center border-r border-gray-300 pr-4'>
                  <div className='flex items-center'>
                    <LucideStar className='h-6 w-6 text-yellow-500 mr-2' />
                    <span className='font-bold text-2xl'>
                      {reviewData?.ratings || <p className='p-4 text-xs text-gray-500 dark:text-gray-300'>
                No data
              </p>}
                    </span>
                  </div>
                  <span className='text-xs text-green-600 mt-1'>
                    Property Rating Average
                  </span>
                </div>
                <div className='flex flex-col items-center justify-center text-center pl-4'>
                  <div className='flex items-center'>
                    <MessageSquare className='h-6 w-6 text-yellow-500 mr-2' />
                    <span className='font-bold text-2xl'>
                       {reviewData?.totalReviews ||  <p className='p-4 text-xs text-gray-500 dark:text-gray-300'>
                No data
              </p>} 
                    </span>
                  </div>
                  <span className='text-xs text-green-600 mt-1'>
                    Total reviews of the selected property
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className='row-span-2 bg-white dark:bg-secondary rounded-lg border-gray-300'>
              <p className='p-4 text-xs text-gray-500 dark:text-gray-300'>
                Reviews Under Your Company
              </p>
              <CardContent className='overflow-y-auto max-h-[250px]'>
                <Reviews />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewsAnalytics;

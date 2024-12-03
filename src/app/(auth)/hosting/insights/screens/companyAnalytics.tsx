"use client";

import { useState, useEffect } from "react";
import { getAnalytics } from "@/actions/analytics/getCompanyAnalytics";

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState({ count: 0, previousCount: 0 });
  const [selectedDays, setSelectedDays] = useState(7);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      const result = await getAnalytics(selectedDays);
      setAnalytics(result || { count: 0, previousCount: 0 });
      setLoading(false);
    }

    fetchAnalytics();
  }, [selectedDays]);

  const percentageChange = analytics.previousCount
    ? ((analytics.count - analytics.previousCount) / analytics.previousCount) * 100
    : 0;

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4">
      <div className=" rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Company Visits</h2>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="text-3xl font-bold">{`${analytics.count}`}</div>
        )}
        <div className="mt-4">
          <select
            value={selectedDays}
            onChange={(e) => setSelectedDays(Number(e.target.value))}
            className="p-2  rounded-md w-full"
          >
            <option value={1}>1 Day</option>
            <option value={7}>7 Days</option>
            <option value={30}>30 Days</option>
            <option value={365}>Entire Year</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;

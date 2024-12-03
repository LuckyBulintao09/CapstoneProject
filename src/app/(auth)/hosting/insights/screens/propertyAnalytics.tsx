"use client";

import { useState, useEffect } from "react";
import { getPropertyAnalytics } from "@/actions/analytics/getPropertyAnalytics";

const PropertyAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState<number | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("total");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchPropertyAnalytics() {
      try {
        setLoading(true);
        const data = await getPropertyAnalytics(selectedPeriod);
        setAnalyticsData(data);
      } catch (error) {
        console.error("Error fetching property analytics:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPropertyAnalytics();
  }, [selectedPeriod]);

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4">
      <div className=" rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Property Visits</h2>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="text-3xl font-bold">{`${analyticsData}`}</div>
        )}
        <div className="mt-4 bg-transparent">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="p-2 rounded-md w-full"
          >
            <option value="total">Total</option>
            <option value="30days">Last 30 Days</option>
            <option value="7days">Last 7 Days</option>
            <option value="1day">Last 1 Day</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default PropertyAnalytics;

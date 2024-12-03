"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; 
import { getPropertyAnalytics } from "@/actions/analytics/getPropertyAnalytics"; 

function PropertyAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<number | null>(null); 
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("total"); 

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
    <div className="max-w-xl mx-auto mt-8 p-4">
      <Card className="shadow-lg rounded-lg">
        <CardHeader className="p-4 border-b">
          <CardTitle className="text-2xl font-semibold">Property Analytics</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-4">
            <select
              id="time-period"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="mt-2 p-2 border rounded-md w-full"
            >
              <option value="total">Total</option>
              <option value="30days">Last 30 Days</option>
              <option value="7days">Last 7 Days</option>
              <option value="1day">Last 1 Day</option>
            </select>
          </div>

          {loading ? (
            <div>Loading...</div> 
          ) : (
            <div>
              {analyticsData !== null ? (
                <p className="text-lg">Total Property Visits: {analyticsData}</p> 
              ) : (
                <p>No analytics data available</p> 
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default PropertyAnalytics;

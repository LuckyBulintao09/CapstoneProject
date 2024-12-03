"use client";

import { useState, useEffect } from "react";
import { getAnalytics } from "@/actions/analytics/getCompanyAnalytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserIcon } from "lucide-react";
const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState({ count: 0, company_id: null, previousCount: 0 });
  const [selectedDays, setSelectedDays] = useState(7);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      const result = await getAnalytics(selectedDays);
      setAnalytics(result || { count: 0, company_id: null, previousCount: 0 });
      setLoading(false);
    }

    fetchAnalytics();
  }, [selectedDays]);

  const percentageChange = analytics.previousCount
    ? ((analytics.count - analytics.previousCount) / analytics.previousCount) * 100
    : 0;

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4">
      <Card className="shadow-lg rounded-lg">
        <CardHeader className="p-4 border-b">
          <CardTitle className="text-2xl font-semibold">Company Visits</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div>
              <div className="text-3xl font-bold">{`${analytics.count}`}<UserIcon/></div>
            </div>
          )}
          <div className="mt-4">
            <select
              value={selectedDays}
              onChange={(e) => setSelectedDays(Number(e.target.value))}
              className="mt-2 p-2 border rounded-md w-full"
            >
              <option value={1}>1 Day</option>
              <option value={7}>7 Days</option>
              <option value={30}>30 Days</option>
              <option value={365}>Entire Year</option>
            </select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPage;

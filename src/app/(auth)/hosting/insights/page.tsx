import React from "react";
import AnalyticsPage from "./screens/companyAnalytics";
import PropertyAnalytics from "./screens/propertyAnalytics";
import PropertyVSProperty from "./screens/propertyVSproperty";
import Reviews from "./screens/reviews";
function Page() {
  return (
    <div className="flex flex-col space-y-6 p-8 m-1">
      <div className="flex space-x-6">
        <div className="flex flex-col space-y-6 border flex-shrink-0 w-1/8">
        <AnalyticsPage />
        <PropertyAnalytics />
        </div>

        <div className="flex-1 border p-4">
          <PropertyVSProperty />
        </div>
      </div>
      <p className="text-xl font-semibold">Reviews under your company.</p>
      <div className="flex-1 border p-8">
        <Reviews />
      </div>
    </div>
  );
}

export default Page;

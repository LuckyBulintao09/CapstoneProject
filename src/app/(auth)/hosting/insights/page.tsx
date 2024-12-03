import React from "react";
import AnalyticsPage from "./screens/companyAnalytics";
import BookingRate from "./screens/BookingRate";
import PropertyAnalytics from "./screens/propertyAnalytics";

function Page() {
  return (
    <div className="flex flex-row space-y-6">
      <div className="flex space-x-6"> 
        <div className="flex-1">
          <AnalyticsPage />
        </div>
        <div className="flex-1">
          <BookingRate />
        </div>
      </div>
      <div>
      <PropertyAnalytics />
      </div>
    </div>
  );
}

export default Page;

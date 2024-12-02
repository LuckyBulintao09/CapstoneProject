import React from 'react';
import { getAnalytics } from '@/actions/analytics/getCompanyAnalytics';

export default async function Page() {
  const companyAnalytics = await getAnalytics();

  return (
    <>
    <div>
      <h1>Insights</h1>
      <h2>Company visits: {companyAnalytics}</h2>
    </div>
     <div>
     <h2>Property visits:not fetched yet  </h2>

   </div>
   <div>
     <h2>Booking Rate per day:not fetched yet </h2>
   </div>
   <p>Will design later, fetch only</p>
   </>
  );
}

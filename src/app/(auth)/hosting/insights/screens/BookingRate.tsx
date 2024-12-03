import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Ensure correct import of ShadCN components

function BookingRate() {
  // Static dummy data
  const dummyData = {
    totalBookings: 1500,
    successfulBookings: 1450,
    bookingRate: 96.7, // Booking rate in percentage
  };

  return (
    <div className="max-w-xl mx-auto mt-8 p-4"> {/* Center and add padding */}
      <Card className="shadow-lg rounded-lg">
        <CardHeader className="p-4 border-b">
          <CardTitle className="text-2xl font-semibold">Booking Rate</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {/* Display the dummy data */}
          <div className="mb-4">
            <p className="text-lg font-medium">Total Bookings: </p>
            <p className="text-xl font-semibold">{dummyData.totalBookings}</p>
          </div>
          <div className="mb-4">
            <p className="text-lg font-medium">Successful Bookings: </p>
            <p className="text-xl font-semibold">{dummyData.successfulBookings}</p>
          </div>
          <div className="mb-4">
            <p className="text-lg font-medium">Booking Rate: </p>
            <p className="text-xl font-semibold">{dummyData.bookingRate}%</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default BookingRate;

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function ArrivingCard({ data }) {
    return (
        <Card className="w-auto max-w-sm shadow-lg border rounded-lg bg-backround hover:shadow-xl transition-shadow duration-300">
          {/* Header */}
          <div className="p-4 bg-primary from-blue-500 to-blue-700 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold uppercase">
                  {new Date(data.appointment_date).toLocaleString("default", {
                    month: "long",
                  })}
                </h3>
                <span className="text-3xl font-bold">
                  {new Date(data.appointment_date).getDate()}
                </span>
              </div>
              <div className="text-sm">
                <strong>{data.account ? `${data.account.firstname} ${data.account.lastname}` : data.client_name}</strong>
                <p>Appointment</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <CardContent className="p-6 text-sm text-gray-800">
            <div className="flex justify-between items-center">
              <p className="font-medium">
                <strong className="">Service:</strong> {data.service_option}
              </p>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  data.transaction_status === "reserved"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {data.transaction_status}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <p>
                <strong>Guests:</strong> {data.guest_number}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <p className="font-medium">
                <strong>Paid:</strong>{" "}
              </p>
              
              <span
                className={`${
                  data.isPaid ? "text-green-500" : "text-red-500"
                } font-semibold`}
              >
                {data.isPaid ? "Yes" : "No"}
              </span>
              
            </div>
            <div className="flex justify-between items-center">
              <p>
                <strong>Payment:</strong> {data.payment_option}
              </p>
            </div>
          </CardContent>

          {/* Footer */}
          <div className="p-4 bg-background text-gray-600 text-center rounded-b-lg border-t">
            <p className="text-xs">Reserved on {new Date(data.created_at).toDateString()}</p>
          </div>
        </Card>


      
    );
  }
  
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Table, TableFooter, TableRow, TableCell } from "@/components/ui/table";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { format } from "date-fns";

const supabase = createClient();

interface BookingCardProps {
  price: number;
  unitId: number;
}

export const BookingCard: React.FC<BookingCardProps> = ({ price, unitId }) => {
  const [date, setDate] = useState<Date | undefined>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string>("");

  const today = new Date(); // Define `today` so it is accessible throughout the component

  useEffect(() => {
    const fetchUserId = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        console.error("Error retrieving session:", error.message);
        return;
      }
      if (session?.user) setUserId(session.user.id);
    };
    fetchUserId();
  }, []);

  const handleReserve = async () => {
    if (!date || !userId || !selectedService) {
      alert(
        "Please select a date, service option, and ensure you're logged in."
      );
      return;
    }

    try {
      const formattedDate = date ? format(date, "yyyy-MM-dd") : "";
      const { error } = await supabase.from("transaction").insert([
        {
          user_id: userId,
          service_option: selectedService,
          appointment_date: formattedDate,
          transaction_status: "pending",
          isPaid: false,
          unit_id: unitId,
        },
      ]);

      if (error) {
        console.error("Error saving reservation:", error.message);
        alert("Failed to save reservation. Please try again.");
        return;
      }

      alert("Reservation submitted successfully!");
    } catch (error) {
      console.error("Error submitting reservation:", error);
    }
  };

  const handleCalendarToggle = () => setIsCalendarOpen((prev) => !prev);

  return (
    <Card className="w-[350px] bg-white dark:bg-secondary shadow-lg lg:mt-0 md:mt-4 sm:mt-4 xs:mt-4">
      <CardHeader>
        <CardTitle>
          <span className="font-bold mr-1">₱{price}</span>
          <span className="font-light">/ month</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="service" className="font-semibold">
                Service Option
              </Label>
              <RadioGroup
                value={selectedService}
                name="service"
                onValueChange={setSelectedService}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="On-Site Visit" id="r1" />
                  <Label htmlFor="r1">On-Site Visit</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Room Reservation" id="r2" />
                  <Label htmlFor="r2">Room Reservation</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="relative">
              <Label htmlFor="date" className="font-semibold">
                Appointment Date
              </Label>
              <p className="text-sm mb-1 italic">
                Select the date for your visit.
              </p>
              <div className="flex items-center border-b pb-5">
                <Input
                  id="date"
                  type="text"
                  value={date ? format(date, "MM/dd/yyyy") : ""}
                  onFocus={handleCalendarToggle}
                  readOnly
                  className="border-gray-400 pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={handleCalendarToggle}
                >
                  <CalendarIcon className="h-4 w-4 mt-6" />
                </button>
              </div>
              {isCalendarOpen && (
                <div className="absolute z-10 mt-2 left-1/2 transform -translate-x-1/2">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(selectedDate) => {
                      setDate(selectedDate);
                      setIsCalendarOpen(false);
                    }}
                    disabled={(date) => date < today}
                    className="rounded-md border shadow bg-white"
                  />
                </div>
              )}
            </div>
          </div>
          <Table className="min-w-full">
            <TableFooter>
              <TableRow className="bg-white dark:bg-accent">
                <TableCell className="font-semibold">Initial Total</TableCell>
                <TableCell className="text-right">₱{price}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleReserve} className="w-full">
          Reserve
        </Button>
      </CardFooter>
    </Card>
  );
};

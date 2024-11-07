import React, { useState, useEffect } from "react";
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
import { NavbarModalLogin } from "@/components/navbar/NavbarModalLogin";
import {
  fetchUserData,
  checkUnitReservationStatus,
  createReservation,
  checkExistingReservation,
} from "@/actions/listings/booking-process";
import { toast } from "sonner";
import { format } from "date-fns";

interface BookingCardProps {
  price: number;
  unitId: number;
}

export const BookingCard: React.FC<BookingCardProps> = ({ price, unitId }) => {
  const [date, setDate] = useState<Date | undefined>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string>("");
  const [hasReservation, setHasReservation] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isUnitReserved, setIsUnitReserved] = useState<boolean>(false);

  const today = new Date();

  useEffect(() => {
    async function fetchData() {
      const user = await fetchUserData();
      if (user) {
        setUserId(user);

        const existingReservation = await checkExistingReservation(
          user,
          unitId
        );
        if (existingReservation) {
          setHasReservation(true);
        }

        const reservedStatus = await checkUnitReservationStatus(unitId);
        setIsUnitReserved(reservedStatus);
      }
    }

    fetchData();
    const intervalId = setInterval(async () => {
      const reservedStatus = await checkUnitReservationStatus(unitId);
      setIsUnitReserved(reservedStatus);
    }, 2000);
    return () => clearInterval(intervalId);
  }, [unitId]);

  const handleReserve = async () => {
    const userSessionId = await fetchUserData();

    if (!userSessionId) {
      setIsLoginModalOpen(true);
      return;
    }

    if (isUnitReserved) {
      toast.error(
        "This unit is already reserved. You cannot make a reservation."
      );
      return;
    }

    if (hasReservation) {
      toast.error("You already have a reservation for this unit.");
      return;
    }

    if (!date || !selectedService) {
      toast.error("Please select a date and service option.");
      return;
    }

    const result = await createReservation(
      userSessionId,
      unitId,
      selectedService,
      date
    );

    if (!result.success) {
      toast.error(
        result.error || "Failed to save reservation. Please try again."
      );
      return;
    }

    toast.success("Reservation submitted successfully!");
    setHasReservation(true);
    setIsUnitReserved(true);
  };

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    fetchUserData();
  };

  return (
    <>
      <Card className="w-[350px] bg-white dark:bg-secondary shadow-lg mt-4">
        <CardHeader>
          <CardTitle>
            <span className="font-bold mr-1">₱{price}</span>
            <span className="font-light">/ month</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            {/* Service Option Section */}
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
            {/* Appointment Date Section */}
            <div className="relative">
              <Label htmlFor="date" className="font-semibold">
                {selectedService === "On-Site Visit"
                  ? "Visit Date"
                  : selectedService === "Room Reservation"
                  ? "Date of Move"
                  : "Appointment Date"}
              </Label>
              <p className="text-sm mb-1 italic">
                {selectedService === "On-Site Visit"
                  ? "Select the date for your visit."
                  : selectedService === "Room Reservation"
                  ? "Select your move-in date."
                  : "Select the date for your appointment."}
              </p>
              <div className="flex items-center border-b pb-5">
                <Input
                  id="date"
                  type="text"
                  value={date ? format(date, "MM/dd/yyyy") : ""}
                  onFocus={() => setIsCalendarOpen(true)}
                  readOnly
                  className="border-gray-400 pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setIsCalendarOpen((prev) => !prev)}
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
          {/* Total Section */}
          <Table className="min-w-full">
            <TableFooter>
              <TableRow className="bg-white dark:bg-accent">
                <TableCell className="font-semibold">Initial Total</TableCell>
                <TableCell className="text-right">₱{price}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-end">
          {hasReservation ? (
            <Button disabled className="w-full">
              Already Has a Reservation
            </Button>
          ) : isUnitReserved ? (
            <Button disabled className="w-full">
              Already Reserved
            </Button>
          ) : (
            <Button
              onClick={handleReserve}
              className="w-full"
              disabled={!date || !selectedService}
            >
              Reserve
            </Button>
          )}
        </CardFooter>
      </Card>
      {/* Login Modal */}
      {isLoginModalOpen && (
        <NavbarModalLogin
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          openModal={() => setIsLoginModalOpen(true)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </>
  );
};

import { Cross2Icon, EnterIcon, PersonIcon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { DataTableViewOptions } from "./data-table-view-options";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";

import React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, MoreVertical } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

const statuses = [
  {
    value: "Onsite Visit",
    label: "Onsite Visit",
    icon: PersonIcon,
  },
  {
    value: "Room Reservation",
    label: "Room Reservation",
    icon: EnterIcon,
  },
];

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  // check if the table is filtered, if it is show a export or print button
  // const [filteredRows, setFilteredRows] = React.useState([]);how to make this array of objects into table data
  // console.log('Table', table.getFilteredRowModel().flatRows[0].original)

  // const rowz = table.getFilteredRowModel().flatRows;
  // React.useEffect(() => {
  //     setFilteredRows(
  //         rowz.map((flatRow) => [
  //             flatRow.original.room_number,
  //             flatRow.original.room_namen,
  //             flatRow.original.service_option,
  //             format(
  //                 parseISO(flatRow.original.appointment_date),
  //                 "MMMM dd, yyyy"
  //             ),
  //         ])
  //     );
  // }, [table.getFilteredRowModel().flatRows]);
  // console.log("Filtered rows: ", filteredRows);

  // const exportToPDF = () => {
  //     const appointmentPDF = new jsPDF();

  //     const headerTitle = (data) => {
  //         const logoWidth = 16;
  //         const logoHeight = 16;
  //         appointmentPDF.setFontSize(14);
  //         appointmentPDF.text(
  //             "Balangue-Punla Dental Clinic",
  //             data.settings.margin.left + logoWidth + 3,
  //             logoHeight + logoHeight / 9
  //         );
  //     };
  //     const headerSubTitle = (data) => {
  //         const logoWidth = 16;
  //         const logoHeight = 16;
  //         appointmentPDF.setFontSize(10);
  //         appointmentPDF.text(
  //             "Appointment Scheduling System",
  //             data.settings.margin.left + logoWidth + 3,
  //             logoHeight + logoHeight / 3
  //         );
  //     };

  //     const headerRight = (data) => {
  //         const pageSize = appointmentPDF.internal.pageSize;
  //         const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();

  //         const textWidth = appointmentPDF.getStringUnitWidth("Test");
  //         const xCoordinate = pageWidth - data.settings.margin.right - textWidth;

  //         appointmentPDF.setFontSize(9);
  //         appointmentPDF.text("CH8W+2GC, Gen. Luna Rd, Baguio, Benguet", xCoordinate, 16, {align: 'right'});
  //         appointmentPDF.text("Contact No. 0928 550 2774", xCoordinate, 20, {align: 'right'});
  //         appointmentPDF.text("Mon to Thu at 8:00AM - 5:00PM, Fri at 8:00AM - 12:00PM ", xCoordinate, 24, {align: 'right'});
  //     };

  //     // Table content
  //     const data = filteredRows;
  //     autoTable(appointmentPDF, {
  //         head: [["Service", "Date", "Time", "Status", "Message"]],
  //         body: data,
  //         willDrawPage: (data) => {
  //             appointmentPDF.setFontSize(10);

  //             // Logo & text
  //             const logoWidth = 16;
  //             const logoHeight = 16;
  //             appointmentPDF.addImage(
  //                 logo,
  //                 data.settings.margin.right,
  //                 10,
  //                 logoWidth,
  //                 logoHeight
  //             );
  //             headerTitle(data);
  //             headerSubTitle(data);
  //             headerRight(data);
  //         },
  //         didDrawPage: (data) => {
  //             // Footer
  //             appointmentPDF.setFontSize(10);
  //             const pageSize = appointmentPDF.internal.pageSize;
  //             const pageHeight = pageSize.height
  //                 ? pageSize.height
  //                 : pageSize.getHeight();
  //             appointmentPDF.text(
  //                 "Page " + data.pageNumber,
  //                 data.settings.margin.left,
  //                 pageHeight - 10
  //             );
  //         },
  //         margin: { top: 30, bottom: 30 },
  //         columnStyles:{ 1 : {
  //             columnWidth: 'auto', cellWidth: 35,
  //         }}
  //     });

  //     appointmentPDF.save("AppointmentHistoryReport.pdf");
  // };

  return (
    <div className="flex flex-wrap lg:flex-nowrap items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {/* Search Input */}
        <Input
          placeholder="Filter by name, service or client message..."
          value={table.getState().globalFilter}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          className="max-w-[400px] h-9"
        />

        {/* Date Picker - Visible on larger screens */}
        <div className="hidden lg:block">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                size={"sm"}
                className={cn(
                  "w-max justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-auto w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 " align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={(date) => {
                  setDate(date);
                  const { from, to } = date ?? {
                    from: undefined,
                    to: undefined,
                  };
                  if (from && to) {
                    table.getColumn("appointment_date")?.setFilterValue({
                      from: new Date(from),
                      to: new Date(to),
                    });
                  } else if (from || to) {
                    table.getColumn("appointment_date")?.setFilterValue({
                      from: from ? new Date(from) : undefined,
                      to: to ? new Date(to) : undefined,
                    });
                  } else {
                    table.getColumn("appointment_date")?.setFilterValue({
                      from: undefined,
                      to: undefined,
                    });
                  }
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Service Options Filter - Visible on larger screens */}
        <div className="hidden lg:block">
          {table.getColumn("service_option") && (
            <DataTableFacetedFilter
              column={table.getColumn("service_option")}
              title="Service Options"
              options={statuses}
            />
          )}
        </div>

        {/* Reset Button */}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters();
              setDate(undefined);
              table.resetSorting();
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      {/* More Options (3-dot menu) for smaller screens */}
      <div className="lg:hidden">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="p-2 hover:bg-white">
              <MoreVertical className="h-5 w-5 hover:text-primary" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-2 mr-10">
            {/* Collapsible menu for small screens */}
            <div className="flex flex-col space-y-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    Pick a date
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={(date) => {
                      setDate(date);
                      const { from, to } = date ?? {
                        from: undefined,
                        to: undefined,
                      };
                      table.getColumn("appointment_date")?.setFilterValue({
                        from: from ? new Date(from) : undefined,
                        to: to ? new Date(to) : undefined,
                      });
                    }}
                    numberOfMonths={1}
                  />
                </PopoverContent>
              </Popover>

              {table.getColumn("service_option") && (
                <DataTableFacetedFilter
                  column={table.getColumn("service_option")}
                  title="Service Options"
                  options={statuses}
                />
              )}
              <div className="sm:hidden">
                <DataTableViewOptions table={table} />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="hidden sm:block">
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}

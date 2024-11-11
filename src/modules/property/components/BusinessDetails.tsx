"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SpecificBranchListings from "../../lessor-dashboard/components/SpecificBranchListings";
import ReviewsUnderCompany from "./ReviewsUnderCompany";
import { getAllPropertyUnderSpecificCompany } from "@/actions/property/getAllPropertyUnderSpecificCompany";
import { getAllUnitUnderProperty } from "@/actions/unit/getAllUnitUnderProperty";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Unit {
  id: number;
  title: string;
  capacity: number;
  price: number;
  availability: boolean;
}

interface Property {
  id: number;
  title: string;
  address: string;
}

interface BusinessDetailsProps {
  companyName: string;
  about: string;
  created_at: string;
  companyId: number;
  firstname: string;
  lastname: string;
  email: string;
  cp_number: string;
}

export function BusinessDetails({
  companyName,
  about,
  created_at,
  companyId,
  firstname,
  lastname,
  email,
  cp_number,
}: BusinessDetailsProps) {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUnitsForAllProperties = async () => {
      setLoading(true);
      try {
        const properties = await getAllPropertyUnderSpecificCompany(companyId);
        const allUnits = await Promise.all(
          properties.map((property) => getAllUnitUnderProperty(property.id))
        );
        setUnits(allUnits.flat());
      } catch (error) {
        console.error("Error fetching units:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnitsForAllProperties();
  }, [companyId]);

  return (
    <div className="xl:flex xl:justify-center">
      <Tabs
        defaultValue="about"
        className="w-[606px] sm:w-[750px] md:w-[1006px] lg:w-[1246px] xl:w-[1300px] px-8 py-4"
      >
        <TabsList className="grid grid-cols-3 dark:text-white dark:bg-opacity-15">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="branchesAndRooms">Properties</TabsTrigger>
          <TabsTrigger value="reviews">Reviews Under this Company</TabsTrigger>
        </TabsList>

        {/* ABOUT SECTION */}
        <TabsContent value="about">
          <Card className="dark:bg-transparent bg-transparent">
            <CardHeader>
              <CardTitle>About {companyName}</CardTitle>
              <CardDescription>
                On UniHomes since{" "}
                {new Date(created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 dark:text-white">
              <div className="space-y-1">{about}</div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PROPERTIES SECTION */}
        <TabsContent value="branchesAndRooms">
          <Card className="dark:bg-transparent bg-transparent">
            <CardHeader>
              <CardTitle>Properties</CardTitle>
              <CardDescription>
                Explore our different properties
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              <ScrollArea className="h-[300px] w-full rounded-md">
                {loading ? (
                  <div>Loading units...</div>
                ) : units.length > 0 ? (
                  <div className="space-y-1 pt-1 pl-2 pb-3">
                    <SpecificBranchListings listings={units} />
                  </div>
                ) : (
                  <p>No units available.</p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* REVIEWS SECTION */}
        <TabsContent value="reviews">
          <Card className="dark:bg-transparent bg-transparent">
            <CardHeader>
              <CardTitle>Customer Reviews</CardTitle>
              <CardDescription>Read what people have to say</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] w-full rounded-md p-4">
                <ReviewsUnderCompany companyId={companyId} />
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

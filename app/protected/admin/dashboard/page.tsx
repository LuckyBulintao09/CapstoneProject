"use client";
import React, { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import ModeToggle from "@/components/mode-toggle";
import { Spinner } from "@nextui-org/spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { getAllCards } from "@/app/actions/cards/getAllCards";

interface CardData {
  title: string;
  short_desc: string;
  thumbnail_url: string;
  short_description: string;
  updated_at: string | null;
  created_at: string;
}

function Page() {
  const [cardData, setCardData] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllCards();

        if (Array.isArray(data)) {
          setCardData(data);  
        } else {
          console.error("Error fetching cards:", data.error);
        }
      } catch (error) {
        console.error("Error fetching card data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  return (
    <>
      <div className="p-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/protected/admin/dashboard">Admin</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/protected/admin/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Resources</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex justify-end gap-2">
          <Button className="bg-blue-800 dark:bg-blue-800 dark:text-white hover:bg-blue-900">+New card</Button>
          <ModeToggle />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mt-4">
          {cardData.length > 0 ? (
            cardData.map((card, index) => (
              <Card key={index} className="p-2">
                <CardHeader className="p-1">
                  <CardTitle className="text-sm break-words">{card?.title}</CardTitle>
                  <CardDescription className="text-xs break-words">{card?.short_desc}</CardDescription>
                </CardHeader>
                <CardContent className="p-2">
                  <div className="w-full h-40 bg-gray-300 flex justify-center items-center rounded-md">
                    <img
                      src={card?.thumbnail_url}
                      alt={card?.title}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <p className="mt-2 text-xs break-words">{card?.short_description}</p>
                </CardContent>
                <CardFooter className="p-1">
                  <p className="text-xs text-gray-500">
                    {card?.updated_at
                      ? `Updated ${formatDistanceToNow(new Date(card?.updated_at))} ago`
                      : `Created ${formatDistanceToNow(new Date(card?.created_at))} ago`}
                  </p>
                </CardFooter>
              </Card>
            ))
          ) : (
            <p>No content available</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Page;

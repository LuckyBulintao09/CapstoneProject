"use client";
import React, { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { getAllCards } from "@/app/actions/cards/getAllCards";
import { Spinner } from "@nextui-org/spinner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from 'next/link';

interface CardData {
  id: string;
  title: string;
  short_desc: string;
  thumbnail_url: string | null;
  short_description: string;
  created_at: string;
  updated_at: string | null;
}

function Page() {
  const [cardData, setCardData] = useState<CardData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result: CardData[] | { error: string } = await getAllCards();

        if ('error' in result) {
          console.error("Error fetching card data:", result.error);
        } else {
          setCardData(result);
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
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {cardData.length > 0 ? (
          cardData.map((card, index) => (
            <Link 
              key={index} 
              href={{
                pathname: `/resources/${card.id}`,
                query: {
                  title: card.title,
                  short_desc: card.short_description,
                }
              }}
            >
              <Card className="p-2 cursor-pointer">
                <CardHeader className="p-1">
                  <CardTitle className="text-sm break-words">{card?.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                  <div className="w-full h-40 bg-gray-300 flex justify-center items-center rounded-md">
                    {card?.thumbnail_url ? (
                      <img
                        src={card?.thumbnail_url}
                        alt={card?.title}
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <p className="text-sm text-gray-500">No image available</p>
                    )}
                  </div>
                  <p className="mt-2 text-xs break-words">{card?.short_description}</p>
                </CardContent>
                <CardFooter className="p-1">
                  <p className="text-xs text-gray-500">
                    {card?.updated_at ? (
                      new Date(card.updated_at).getTime() > Date.now() - 24 * 60 * 60 * 1000
                        ? `Latest content was posted ${formatDistanceToNow(new Date(card.updated_at))} ago.`
                        : `Updated ${formatDistanceToNow(new Date(card.updated_at))} ago`
                    ) : null}
                  </p>
                </CardFooter>
              </Card>
            </Link>
          ))
        ) : (
    
          <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-500 text-xl font-semibold text-center">
            No content found.
          </p>
        </div>
        
        
        )}
      </div>
    </div>
  );
}

export default Page;


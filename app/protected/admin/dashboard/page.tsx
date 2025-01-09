"use client";
import React, { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { getAllCards } from "@/app/actions/cards/getAllCards";
import Link from "next/link";
import { EllipsisVertical } from "lucide-react";
import { deleteCard } from "@/app/actions/cards/deleteCard";

interface CardData {
  id: string;
  title: string;
  short_desc: string;
  thumbnail_url: string | null;
  short_description: string;
  updated_at: string | null;
  created_at: string;
}

function Page() {
  const [cardData, setCardData] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [programToDelete, setProgramToDelete] = useState<string | null>(null); 

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

  const handleDeleteProgram = async (programId: string) => {
    console.log("Deleting program with ID:", programId);
    await deleteCard(programId)
    setIsModalOpen(false); 
  };

  const openModal = (programId: string) => {
    setProgramToDelete(programId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

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
              <BreadcrumbPage>Programs</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex justify-end gap-2">
          <Link href={"/protected/admin/dashboard/create"}>
            <Button className="bg-blue-800 dark:bg-blue-800 dark:text-white hover:bg-blue-900">
              + Add New Program
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mt-4">
          {cardData.length > 0 ? (
            cardData.map((card) => (
              <a
                key={card.id}
                href={`/protected/admin/dashboard/${card.id}`}
                className="block"
              >
                <Card className="p-2 hover:shadow-lg transition-shadow">
                  <CardHeader className="p-1">
                    <CardTitle className="text-sm break-words flex justify-between items-center">
                      <span className="flex-1">
                        <p>{card?.title}</p>
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <EllipsisVertical className="text-gray-500 w-4 h-4 cursor-pointer" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem asChild>
                            <Link
                              href={{
                                pathname: `/protected/admin/dashboard/edit/${card.id}`,
                                query: {
                                  id: card.id,
                                  title: card.title,
                                  short_desc: card.short_desc,
                                  thumbnail_url: card.thumbnail_url,
                                  short_description: card.short_description,
                                  updated_at: card.updated_at,
                                  created_at: card.created_at,
                                },
                              }}
                            >
                              Edit Program
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Button
                              onClick={() => openModal(card.id)}
                              className="bg-transparent text-red-600 dark:text-red-600 dark:bg-transparent"
                            >
                              Delete Program
                            </Button>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardTitle>
                    <CardDescription className="text-xs break-words">
                      {card?.short_desc}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-2">
                    <div className="w-full h-40 bg-gray-300 flex justify-center items-center rounded-md">
                      {card.thumbnail_url ? (
                        <img
                          src={card.thumbnail_url}
                          alt={card.title}
                          className="w-full h-full object-cover rounded-md"
                        />
                      ) : null}
                    </div>
                    <p className="mt-2 text-xs break-words">
                      {card?.short_description}
                    </p>
                  </CardContent>
                  <CardFooter className="p-1">
                    <p className="text-xs text-gray-500">
                      {card?.updated_at
                        ? `Latest content was ${formatDistanceToNow(
                            new Date(card?.updated_at)
                          )} ago`
                        : `Created ${formatDistanceToNow(new Date(card?.created_at))} ago`}
                    </p>
                  </CardFooter>
                </Card>
              </a>
            ))
          ) : (
            <p className="text-gray-500">No program created.</p>
          )}
        </div>
      </div>

      {/* Modal for Delete Confirmation */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white text-white p-6 rounded-lg shadow-lg w-96 dark:bg-gray-800">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Confirm Deletion</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Are you sure you want to delete this program?</p>
            <div className="mt-4 flex justify-between">
              <Button onClick={closeModal} className="bg-gray-400 text-white">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (programToDelete) {
                    handleDeleteProgram(programToDelete);
                  }
                }}
                className="bg-red-600 text-white"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Page;

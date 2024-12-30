"use client";
import React, { useState, useEffect } from "react";
import { Spinner } from "@nextui-org/spinner";
import { getPaginatedAnnouncements } from "@/app/actions/announcement/getAllAnnouncement";

interface Announcement {
  subject: string;
  content: string;
  created_at: string;
}

interface PaginatedAnnouncements {
  data: Announcement[];
  count: number | null;
}

function Page() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoading(true);
      try {
        const { data, count }: PaginatedAnnouncements = await getPaginatedAnnouncements(page);
        setAnnouncements(data);
        setTotalPages(Math.ceil((count ?? 0) / 10)); 
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error fetching announcements:", error.message);
        } else {
          console.error("Unknown error fetching announcements:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [page]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-center h-[90px] w-screen dark:bg-blue-900 bg-blue-800">
        <div className="w-full px-2 py-8 max-w-7xl">
          <div className="flex flex-col items-center text-center rounded-b-2xl">
            <h1 className="font-semibold lg:text-3xl md:text-2xl text-1xl text-white">
              Announcements
            </h1>
            <p className="lg:text-md md:text-md sm:text-sm text-gray-200">
              Stay updated with the latest announcements
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 max-w-7xl mx-auto">
        {announcements.length > 0 ? (
          <div className="space-y-4">
            {announcements.map((announcement, index) => (
              <div
                key={index}
                className="flex flex-col border border-gray-300 p-6 rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer dark:bg-gray-800 dark:border-gray-600"
                onClick={() => setSelectedAnnouncement(announcement)}
              >
                <h2 className="text-lg font-semibold text-gray-800  dark:text-white">
                  {announcement.subject}
                </h2>
                <p className="text-sm text-gray-600 mt-1 line-clamp-3 dark:text-gray-300">
                  {announcement.content}
                </p>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Announced on {new Date(announcement.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">No announcements available.</p>
        )}
      </div>

      <div className="flex justify-center gap-4 mt-6 mb-8">
        <button
          onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-transparent disabled:text-gray-400"
        >
          {"< "}Previous
        </button>
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((prevPage) => Math.min(prevPage + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-transparent disabled:text-gray-400"
        >
          Next {">"}
        </button>
      </div>

      {selectedAnnouncement && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-3xl w-full relative overflow-auto">
            <button
              onClick={() => setSelectedAnnouncement(null)}
              className="absolute top-2 right-2 text-xl text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              {selectedAnnouncement.subject}
            </h2>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Announced on {new Date(selectedAnnouncement.created_at).toLocaleDateString()}
            </p>
            <div className="text-sm text-gray-600 mt-2 dark:text-gray-300 max-h-96 overflow-y-auto">
              <p>{selectedAnnouncement.content}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Page;

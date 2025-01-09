"use client";
import React, { useState, useEffect } from "react";
import { Spinner } from "@nextui-org/spinner";
import { getPaginatedAnnouncements } from "@/app/actions/announcement/getAllAnnouncement";
import { EllipsisVertical } from "lucide-react";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { deleteAnnouncement } from "@/app/actions/announcement/deleteAnnouncement";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button";

interface Announcement {
  subject: string;
  content: string;
  created_at: string;
  id: string;
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
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState<Announcement | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

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

  const handleDeleteAnnouncement = async () => {
    if (announcementToDelete) {
      setIsDeleting(true);
      const response = await deleteAnnouncement(announcementToDelete.id);

      if (response.success) {
        setAnnouncements((prevAnnouncements) =>
          prevAnnouncements.filter((announcement) => announcement.id !== announcementToDelete.id)
        );
      } else {
        toast.error("Failed to delete the announcement.");
      }

      setIsDeleting(false);
      closeAllModals();
    }
  };

  const closeAllModals = () => {
    setDeleteModalOpen(false);
    setSelectedAnnouncement(null);
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
    <div className="m-2">
    <Breadcrumb>
             <BreadcrumbList>
               <BreadcrumbItem>
                 <BreadcrumbLink href="/protected/admin/dashboard">Admin</BreadcrumbLink>
               </BreadcrumbItem>
               <BreadcrumbSeparator />
               <BreadcrumbItem>
                 <BreadcrumbPage>Announcements</BreadcrumbPage>
               </BreadcrumbItem>
             </BreadcrumbList>
           </Breadcrumb>
    </div>
      <div className="flex items-center justify-center bg-gray-600 text-white dark:bg-gray-800 p-4 rounded-lg m-2">
        <p>Announcements</p>
      </div>
      <div className="flex justify-end">
        <Button className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600 mr-3">
          +New Announcement
        </Button>
      </div>


      <div className="p-4 max-w-7xl mx-auto">
        {announcements.length > 0 ? (
          <div className="space-y-4">
            {announcements.map((announcement, index) => (
              <div
                key={index}
                className="relative flex flex-col border border-gray-300 p-6 rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer bg-gray dark:border-gray-600"
                onClick={() => setSelectedAnnouncement(announcement)}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <EllipsisVertical className="absolute top-2 right-2 text-gray-500 w-4 h-4 cursor-pointer" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => {
                        setAnnouncementToDelete(announcement);
                        setDeleteModalOpen(true);
                      }}
                    >
                      Delete Announcement
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {announcement.subject}
                </h2>
                <p
                  className="text-sm text-gray-600 mt-1 line-clamp-3 dark:text-gray-300"
                  dangerouslySetInnerHTML={{ __html: announcement.content }}
                />
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

      {selectedAnnouncement && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-3xl w-full relative overflow-auto">
            <button
              onClick={closeAllModals}
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
              <p dangerouslySetInnerHTML={{ __html: selectedAnnouncement.content }} />
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && announcementToDelete && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full relative overflow-auto">
            <button
              onClick={closeAllModals}
              className="absolute top-2 right-2 text-xl text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              &times;
            </button>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Are you sure you want to delete this announcement?
            </h2>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleDeleteAnnouncement}
                className={`px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 ${
                  isDeleting ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Confirm"}
              </button>
              <button
                onClick={closeAllModals}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded ml-2 hover:bg-gray-300"
                disabled={isDeleting}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Page;

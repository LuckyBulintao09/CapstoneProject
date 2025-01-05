"use client";

import { getCardContent } from "@/app/actions/cards/getCardContent";
import { useEffect, useState } from "react";
import { Spinner } from "@nextui-org/spinner";
import { Card, CardHeader, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import SectionBanner from "@/components/global-components/SectionBanner";
import { formatDistanceToNow, format } from "date-fns";
import { useSearchParams } from "next/navigation";

const Page = () => {
  const [id, setId] = useState<string | null>(null);
  const [contentList, setContentList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const searchParams = useSearchParams();
  const title = searchParams.get("title");
  const short_desc = searchParams.get("short_desc");

  useEffect(() => {
    const fetchData = async () => {
      const currentId = window.location.pathname.split("/").pop();
      setId(currentId || null);

      if (currentId) {
        try {
          const cardContent = await getCardContent(currentId);

          if (Array.isArray(cardContent)) {
            setContentList(cardContent);
          } else if (cardContent && cardContent.error) {
            console.error(cardContent.error);
            setContentList([]);
          } else {
            setContentList([]);
          }
        } catch (error) {
          console.error("Error fetching card content:", error);
          setContentList([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  return (
    <>
      <div className="m-2">
        <SectionBanner 
          title={title || null} 
          short_description={short_desc || null} 
        />
      </div>
      <div className="p-6">
        {contentList.length > 0 ? (
          contentList.map((item) => (
            <Card key={item.id} className="w-full mb-4 break-words">
              <CardHeader className="pb-0">
                <h3 className="text-l">{item.subject || "No subject"}</h3>
                <CardDescription className="text-xs text-gray-500">
                  {format(new Date(item.created_at), "MMMM d, yyyy • h:mm a")} •{" "}
                  {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-1">
                  <p
                    className="text-xs text-gray-850"
                    dangerouslySetInnerHTML={{ __html: item.content }}
                  ></p>
                  {item.files && item.files.length > 0 && (
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {item.files.map((file: string, index: number) => {
                        const fileName = file.split("/").pop() || "File";
                        const fileExtension = fileName.includes(".")
                          ? fileName.slice(fileName.lastIndexOf(".") + 1).toUpperCase()
                          : "Unknown";

                        return (
                          <div
                            key={index}
                            className="flex items-center border rounded-lg shadow-md p-4 bg-transparent"
                          >
                            <div className="w-16 h-16  flex items-center bg-gray-200 justify-center rounded-md mr-4">
                              <span className="text-sm font-bold text-gray-500">
                                {fileExtension}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <p className="text-sm font-medium truncate">{fileName}</p>
                              <p className="text-xs text-gray-500">{fileExtension}</p>
                              <a
                                href={file}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 text-xs underline mt-1"
                              >
                                Download
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>

            </Card>
          ))
        ) : (
          <div className="flex justify-center items-center min-h-screen">
            <p className="text-lg text-gray-500">No content</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Page;

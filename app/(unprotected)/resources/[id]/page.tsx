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
  const shortDesc = searchParams.get("short_desc");

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
      {/* Pass title and short_desc to SectionBanner */}
      <div className="m-2">
        <SectionBanner 
          title={title || "Default Title"} 
          short_description={shortDesc || "Default short description"} 
        />
      </div>
      <div className="p-6">
        {/* Display passed title and short_desc from URL query */}
        {title && shortDesc && (
          <div className="mb-4">
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="text-sm text-gray-500">{shortDesc}</p>
          </div>
        )}

        {contentList.length > 0 ? (
          contentList.map((item) => (
            <Card key={item.id} className="w-full mb-4 shadow-md">
              <CardHeader className="pb-0">
                <h3 className="text-l">{item.subject || "No subject"}</h3>
                <CardDescription className="text-xs text-gray-500">
                  {format(new Date(item.created_at), "MMMM d, yyyy")} •{" "}
                  {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm">{item.content}</p>
                {item.files && item.files.length > 0 && (
                  <ul className="mt-2">
                    {item.files.map((file: string, index: number) => (
                      <li key={index} className="text-blue-600 text-xs underline">
                        <a href={file} target="_blank" rel="noopener noreferrer">
                          {file.split("/").pop()}
                        </a>
                      </li>
                    ))}
                  </ul>
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

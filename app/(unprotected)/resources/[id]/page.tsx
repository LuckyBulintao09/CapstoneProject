"use client";

import { getCardContent } from "@/app/actions/cards/getCardContent";
import { useEffect, useState } from "react";

const Page = () => {
  const [id, setId] = useState<string | null>(null);
  const [contentList, setContentList] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const currentId = window.location.pathname.split("/").pop();
      setId(currentId || null);

      if (currentId) {
        try {
          const cardContent = await getCardContent(currentId);

          // Check if cardContent is an array or an object with an error
          if (Array.isArray(cardContent)) {
            setContentList(cardContent);
          } else if (cardContent && cardContent.error) {
            console.error(cardContent.error);
            setContentList([]); // Set to an empty array in case of error
          } else {
            setContentList([]); // Fallback in case of unexpected format
          }
        } catch (error) {
          console.error("Error fetching card content:", error);
          setContentList([]); // Fallback to an empty array in case of fetch failure
        }
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <p>{id}</p>
      {contentList.length > 0 ? (
        contentList.map((item) => (
          <div key={item.id} className="border-b border-gray-300 py-4">
            <h3 className="text-xl font-bold">{item.subject}</h3>
            <p className="text-sm text-gray-600">{item.content || "No content available"}</p>
            <div className="mt-2">
              {item.files && item.files.length > 0 ? (
                <ul>
                  {item.files.map((file: string, index: number) => (
                    <li key={index}>
                      <a href={file} target="_blank" className="text-blue-600" rel="noopener noreferrer">
                        {file.split("/").pop()}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No files attached.</p>
              )}
            </div>
          </div>
        ))
      ) : (
        <p>Loading content...</p>
      )}
    </div>
  );
};

export default Page;

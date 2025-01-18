"use client";

import { getSpecificCard } from '@/app/actions/cards/getSpecificCard';
import SectionBanner from '@/components/global-components/SectionBanner';
import { format } from "date-fns";
import { Card, CardHeader, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import React, { useEffect, useState } from 'react';
import { Trash2, X } from 'lucide-react';
import { Spinner } from '@nextui-org/spinner';
import { insertCardContent } from '@/app/actions/cards/insertCardContent';
import { toast } from 'sonner';
import { getCardContent } from '@/app/actions/cards/getCardContent';
import { deleteSingleCardContent } from '@/app/actions/cards/deleteSingleCardContent';


export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);

  const [data, setData] = useState<any>(null);
  const [contentData, setContentData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false); 
  const [deleteId, setDeleteId] = useState<string | null>(null); 
  const [fileInputs, setFileInputs] = useState<(File | null)[]>([]);
  const [isFirstFileAdded, setIsFirstFileAdded] = useState<boolean>(false);

  const [subject, setSubject] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const maxSubjectLength = 100;
  const maxContentLength = 500;

  const fetchData = async () => {
    try {
      const cardData = await getSpecificCard(id);
      setData(cardData);

      const cardContent = await getCardContent(id);

      if ('error' in cardContent) {
        console.error(cardContent.error);
        setContentData([]);
      } else {
        setContentData(cardContent);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setContentData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSubject('');
    setContent('');
    setFileInputs([]);
    setIsFirstFileAdded(false);
  };

  const handleDeleteClick = (contentId: string) => {
    setDeleteId(contentId); 
    setIsDeleteModalOpen(true); 
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId || isSubmitting) return; 
  
    setIsSubmitting(true); 
  
    try {
      await deleteSingleCardContent(deleteId);
      setIsDeleteModalOpen(false);
      setDeleteId(null);
      fetchData();
      toast.success("Content deleted successfully.");
    } catch (error) {
      toast.error("Error deleting content.");
    } finally {
      setIsSubmitting(false); 
    }
  };
  

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteId(null); 
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newFiles = [...fileInputs];
    newFiles[index] = e.target.files ? e.target.files[0] : null;
    setFileInputs(newFiles);
  };

  const handleAddFileInput = () => {
    setFileInputs([...fileInputs, null]);
    if (!isFirstFileAdded) {
      setIsFirstFileAdded(true);
    }
  };

  const handleRemoveFileInput = (index: number) => {
    const newFiles = fileInputs.filter((_, i) => i !== index);
    setFileInputs(newFiles);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const formattedContent = content.replace(/\n/g, '<br />');

      await insertCardContent(
        id,
        subject,
        formattedContent,
        fileInputs.filter(file => file !== null)
      );

      await fetchData();
      handleCloseModal();
    } catch (error) {
      console.error("Error inserting content:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center text-center p-6 min-h-screen"><Spinner size="lg" color="primary" /></div>;
  }

  return (
    <>
      <div className='m-2'>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/protected/admin/dashboard">Admin</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/protected/admin/dashboard">Programs</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{data?.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="m-2">
        <SectionBanner title={data?.title} short_description={data?.short_description} />
      </div>

      <div className="m-4">
        {data && (
          <>
            <div className="flex justify-end m-2">
              <button
                onClick={handleOpenModal}
                className="bg-blue-800 rounded-md p-2 text-white"
              >
                +New Content
              </button>
            </div>
            {contentData.length > 0 ? (
              contentData.map((item) => (
                <Card key={item.id} className="w-full mb-4 break-words">
                  <CardHeader className="pb-0">
                    <div className="flex justify-between items-center">
                      <h3 className="text-l">{item.subject || "[No subject]"}</h3>
                      <button
                        onClick={() => handleDeleteClick(item.id)} 
                        className="text-gray-500 hover:text-red-500"
                      >
                       <div className="relative group">
                    <Trash2 className="h-3 w-3" />
                    <span className="absolute invisible group-hover:visible bg-black text-white text-xs rounded p-1 left-1/2 transform -translate-x-1/2 bottom-full mb-1">
                      Delete
                    </span>
                  </div>

                      </button>
                    </div>
                    <CardDescription className="text-xs text-gray-500">
                      {format(new Date(item.created_at), "MMMM d, yyyy")} •{" "}
                      {format(new Date(item.created_at), "hh:mm a")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 break-words">
                    <p className="text-sm" dangerouslySetInnerHTML={{ __html: item.content }}></p>
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
                              className="flex items-center border rounded-lg shadow-md p-4 bg-white break-words"
                            >
                              <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded-md mr-4 break-words">
                                <span className="text-sm font-bold text-gray-500">
                                  {fileExtension}
                                </span>
                              </div>
                              <div className="flex flex-col">
                                <p className="text-sm font-medium text-gray-800 break-words">
                                  {fileName}
                                </p>
                                <p className="text-xs text-gray-500 p-1">{fileExtension}</p>
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
          </>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-[80%] m-4 max-h-[90%] overflow-y-auto">
              <h2 className="text-lg font-bold mb-4">Are you sure you want to delete this content?</h2>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={handleCloseDeleteModal}
                  className="px-4 py-2 bg-gray-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  disabled={isSubmitting}  
                  className={`px-4 py-2 text-white rounded-md ${isSubmitting ? 'bg-gray-500' : 'bg-red-600'}`}
                >
                  {isSubmitting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}


        {/* Add New Content Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-[80%] m-4 max-h-[90%] overflow-y-auto">
              <h2 className="text-lg font-bold mb-4">Add New Content</h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      className="w-full p-2 border rounded-md"
                      placeholder="Enter subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value.slice(0, maxSubjectLength))}
                    />
                    <p className="text-xs text-gray-500">{maxSubjectLength - subject.length} characters remaining</p>
                  </div>
                  <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                      Content
                    </label>
                    <textarea
                      id="content"
                      rows={6}
                      className="w-full p-2 border rounded-md"
                      placeholder="Enter content"
                      value={content}
                      onChange={(e) => setContent(e.target.value.slice(0, maxContentLength))}
                    ></textarea>
                    <p className="text-xs text-gray-500">{maxContentLength - content.length} characters remaining</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">File Upload</label>
                    {fileInputs.map((_, index) => (
                      <div key={index} className="mb-4 flex items-center">
                        <input
                          type="file"
                          className="w-full"
                          accept=".pdf, .doc, .docx, .txt, .xls, .xlsx, .jpg, .jpeg, .png, .gif, .bmp, .svg, .webp"
                          onChange={(e) => handleFileChange(e, index)}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveFileInput(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-start mt-4">
                    <button
                      type="button"
                      onClick={handleAddFileInput}
                      className="px-2 py-1 bg-blue-800 text-white rounded-md text-xs"
                    >
                      {isFirstFileAdded ? "+Attach More Files" : "+Attach File"}
                    </button>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 bg-gray-300 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-4 py-2 text-white rounded-md ${isSubmitting ? 'bg-gray-500' : 'bg-blue-600'}`}
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

"use client";

import { getSpecificCard } from '@/app/actions/cards/getSpecificCard';
import CardInfo from '@/components/global-components/CardInfo';
import SectionBanner from '@/components/global-components/SectionBanner';
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Spinner } from '@nextui-org/spinner';
import { insertCardContent } from '@/app/actions/cards/insertCardContent';
import { toast } from 'sonner';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);

  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [fileInputs, setFileInputs] = useState<(File | null)[]>([]); // Change type here
  const [isFirstFileAdded, setIsFirstFileAdded] = useState<boolean>(false);

  const [subject, setSubject] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const maxSubjectLength = 30;
  const maxContentLength = 250;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cardData = await getSpecificCard(id);
        setData(cardData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newFiles = [...fileInputs];
    newFiles[index] = e.target.files ? e.target.files[0] : null; // Allow null here
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
      await insertCardContent(
        id,
        subject,
        content,
        fileInputs.filter(file => file !== null) // Filter out null files
      );
  
      toast.success("Content inserted successfully.");
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
    <div className="m-4">
      {data && (
        <>
          <SectionBanner
            title={data.title}
            short_description={data.short_description}
          />
          <div className="flex justify-end m-2">
            <button
              onClick={handleOpenModal}
              className="bg-blue-800 rounded-md p-2 text-white"
            >
              +New Content
            </button>
          </div>
        </>
      )}
      <CardInfo />

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
                        accept=".pdf, .doc, .docx, .txt"
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
  );
}

"use client";
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createAnnouncement } from '@/app/actions/announcement/createAnnouncement';
import { toast } from 'sonner';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';

const Page: React.FC = () => {
  const [subject, setSubject] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedContent = content.replace(/\n/g, "<br>");
    
    setIsSubmitting(true); 
    const result = await createAnnouncement(subject, formattedContent);

    if (result.success) {
      toast.success('Announcement created successfully.');
      setSubject('');
      setContent('');
      window.location.href = '/protected/admin/announcements';
    }
    else if (result.error) {
      toast.error(result.error);
    }

    setIsSubmitting(false); 
  };

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
      <div className="flex justify-center items-center min-h-screen p-4">
        <Card className="w-full max-w-2xl p-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-blue-500 dark:text-white">Create Announcement</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium">Subject:</label>
                <Input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value.slice(0, 50))}
                  required
                />
                <p className="text-sm text-gray-500">{50 - subject.length} characters left</p>
              </div>
              <div>
                <label className="block text-sm font-medium">Content:</label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value.slice(0, 999))}
                  required
                  className="h-32"
                />
                <p className="text-sm text-gray-500">{999 - content.length} characters left</p>
              </div>
              <Button
                type="submit"
                className="w-full text-lg text-white bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </form>
            {/* Go Back Button */}
            <Button
              onClick={() => window.history.back()}
              className="w-full mt-4 text-lg text-white bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 dark:text-white"
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Page;

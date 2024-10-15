import React from 'react'
import { ContentLayout } from "@/modules/lessor-dashboard/components/ContentLayout"
import PageContent from "@/modules/lessor-dashboard/components/PageContent";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
  } from "@/components/ui/breadcrumb";
import Link from "next/link";

const LessorDashboard = ({ children } : { children: React.ReactNode }) => {
  return (
      <ContentLayout title="Branch">
          <Breadcrumb>
              <BreadcrumbList>
                  <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                          <Link href="/dashboard">Home</Link>
                      </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                      <BreadcrumbPage>Branch</BreadcrumbPage>
                  </BreadcrumbItem>
              </BreadcrumbList>
          </Breadcrumb>

          <PageContent>{children}</PageContent>
      </ContentLayout>
  );
}

export default LessorDashboard
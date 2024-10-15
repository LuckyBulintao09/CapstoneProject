import { ContentLayout } from "@/modules/lessor-dashboard/components/ContentLayout"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
  } from "@/components/ui/breadcrumb";
import Link from "next/link";
import PageContent from "@/modules/lessor-dashboard/components/PageContent";
import AccountSettings from "@/modules/lessor-account/AccountSettings";

const Account = () => {
  return (
      <ContentLayout title="Account">
          <Breadcrumb>
              <BreadcrumbList>
                  <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                          <Link href="/dashboard">Home</Link>
                      </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                      <BreadcrumbPage>Account</BreadcrumbPage>
                  </BreadcrumbItem>
              </BreadcrumbList>
          </Breadcrumb>

          <PageContent>
              <AccountSettings />
          </PageContent>
            
      </ContentLayout>
  );
}

export default Account
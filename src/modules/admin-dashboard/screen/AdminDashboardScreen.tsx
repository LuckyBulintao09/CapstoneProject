import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ReviewsTab } from "../components/ReviewsTab";
import { NewProprietorsTab } from "../components/NewProprietorsTab";
import LandmarksTab from "../components/LandmarksTab";
import { PropertyTab } from "../components/PropertyTab";
import CompanyBillingTab from "../components/CompanyBillingTab";
export function AdminDashboardScreen() {
  return (
    <div className="bg-background dark:bg-secondary h-screen">
      <div className="mx-4 py-10 lg:pt-5">
        <Tabs defaultValue="newProprietors" className="w-full">
          <TabsList className="grid w-full lg:w-[70%] h-[100px] grid-cols-2 lg:grid-cols-5 lg:h-auto">
            <TabsTrigger value="newProprietors">New Proprietors</TabsTrigger>
            <TabsTrigger value="newProperty">New Properties</TabsTrigger>
            <TabsTrigger value="reportedReviews">Reported Reviews</TabsTrigger>
            <TabsTrigger value="landmarks">Landmarks</TabsTrigger>
            <TabsTrigger value="billing">Company Billing</TabsTrigger>
          </TabsList>
          <TabsContent value="newProprietors">
            <NewProprietorsTab />
          </TabsContent>
          <TabsContent value="reportedReviews">
            <ReviewsTab />
          </TabsContent>
          <TabsContent value="newProperty">
            <PropertyTab />
          </TabsContent>
          <TabsContent value="landmarks">
            <LandmarksTab />
          </TabsContent>
          <TabsContent value="billing">
            <CompanyBillingTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

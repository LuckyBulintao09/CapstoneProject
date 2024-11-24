import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ReviewsTab } from "../components/ReviewsTab";
import { NewProprietorsTab } from "../components/NewProprietorsTab";
import LandmarksTab from "../components/LandmarksTab";
import { PropertyTab } from "../components/PropertyTab";
export function AdminDashboardScreen() {
  return (
    <div className="dark:bg-secondary h-screen">
      <div className="mx-4 py-10 lg:pt-5">
        <Tabs defaultValue="newProprietors" className="w-full">
          <TabsList className="grid w-full lg:w-[40%] grid-cols-4">
            <TabsTrigger value="newProprietors">New Proprietors</TabsTrigger>
            <TabsTrigger value="reportedReviews">Reported Reviews</TabsTrigger>
            <TabsTrigger value="newProperty">Property</TabsTrigger>
            <TabsTrigger value="landmarks">Landmarks</TabsTrigger>
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
        </Tabs>
      </div>
    </div>
  );
}

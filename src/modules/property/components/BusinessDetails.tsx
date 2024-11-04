"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SpecificBranchListings from "../../lessor-dashboard/components/SpecificBranchListings";
import ReviewsUnderCompany from "./ReviewsUnderCompany";
import { getAllPropertyUnderSpecificCompany } from "@/actions/property/getAllPropertyUnderSpecificCompany";
import { getAllUnitUnderProperty } from "@/actions/unit/getAllUnitUnderProperty";
import { MapPin } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
interface Unit {
  id: number;
  title: string;
  capacity: number;
  price: number;
  availability: boolean;
}

interface Property {
  id: number;
  title: string;
  address: string;
}

interface BusinessDetailsProps {
  companyName: string;
  about: string;
  created_at: string;
  companyId: number;
  firstname: string;
  lastname: string;
  email: string;
  cp_number: string;
}

export function BusinessDetails({
  companyName,
  about,
  created_at,
  companyId,
  firstname,
  lastname,
  email,
  cp_number,
}: BusinessDetailsProps) {

	const [properties, setProperties] = useState<Property[]>([]);
	const [selectedProperty, setSelectedProperty] = useState<Property | null>(
		null
	);
	const [units, setUnits] = useState<Unit[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [loadingUnits, setLoadingUnits] = useState<boolean>(false);


  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const properties = await getAllPropertyUnderSpecificCompany(companyId);
        setProperties(properties);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [companyId]);

  const handlePropertyClick = async (property: Property) => {
    setSelectedProperty(property);
    setLoadingUnits(true);
    try {
      const units = await getAllUnitUnderProperty(property.id);
      setUnits(units);
    } catch (error) {
      console.error("Error fetching units:", error);
    } finally {
      setLoadingUnits(false);
    }
  };


	return (
		<div className='xl:flex xl:justify-center '>
			<Tabs
				defaultValue='about'
				className='w-[606px] sm:w-[750px] md:w-[1006px] lg:w-[1246px] xl:w-[1300px] px-8 py-4'
			>
				<TabsList className='grid grid-cols-3 dark:text-white dark:bg-opacity-15 dark:bg-transparent'>
					<TabsTrigger value='about'>About</TabsTrigger>
					<TabsTrigger value='branchesAndRooms'>Properties</TabsTrigger>
					<TabsTrigger value='reviews'>Reviews Under this Company</TabsTrigger>
				</TabsList>


        {/* ABOUT SECTION */}
        <TabsContent value="about">
          <Card className="dark:bg-transparent dark:border-none bg-transparent border-gray-200">
            <CardHeader className="dark:border-t-2 dark:border-sky-900">
              <CardTitle>About {companyName}</CardTitle>
              <CardDescription>
                On UniHomes since{" "}
                {new Date(created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 dark:text-white">
              <div className="space-y-1">{about}</div>
            </CardContent>
          </Card>
        </TabsContent>


				{/* PROPERTIES SECTION */}
				<TabsContent value='branchesAndRooms'>
					<Card className='dark:bg-transparent dark:border-none'>
						<CardHeader className='dark:border-t-2 dark:border-sky-900'>
							<CardTitle>Properties</CardTitle>
							<CardDescription>
								Explore our different properties
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-1'>
							{loading ? (
								<div>Loading properties...</div>
							) : (
								<Carousel>
									<CarouselContent>
										{properties?.map((property) => (
											<CarouselItem
												key={property.id}
												className='lg:basis-1/4 md:basis-1/3 sm:basis-1/2 xs:basis-1/2'
												onClick={() => handlePropertyClick(property)}
											>
												<Card
													className={`border-slate-400 ${
														selectedProperty?.id === property.id
															? 'bg-sky-800 text-white'
															: 'bg-none'
													}`}
												>
													<CardContent className='flex flex-col h-16 items-center justify-center p-0'>
														<div>{property.title}</div>
														<div className='flex items-center'>
															<MapPin className='mr-1' height={18} width={18} />
															<small>{property.address}</small>
														</div>
													</CardContent>
												</Card>
											</CarouselItem>
										))}
									</CarouselContent>
								</Carousel>
							)}


              {/* Display available units for selected property */}
              {loadingUnits ? (
                <div>Loading units...</div>
              ) : selectedProperty ? (
                units.length > 0 ? (
                  <div className="space-y-1 pt-1 pl-2">
                    <SpecificBranchListings listings={units} />
                  </div>
                ) : (
                  <p>No units available under this property.</p>
                )
              ) : (
                <p>Please select a property to see available units.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* REVIEWS SECTION */}
        <TabsContent value="reviews">
          <Card className="dark:bg-transparent dark:border-none bg-transparent border-gray-200">
            <CardHeader className="dark:border-t-2 dark:border-sky-900">
              <CardTitle>Customer Reviews</CardTitle>
              <CardDescription>Read what people have to say</CardDescription>
            </CardHeader>
            <CardContent className="flex">
              <ScrollArea className="h-[450px] w-full rounded-md p-4">
                <ReviewsUnderCompany companyId={companyId} />
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

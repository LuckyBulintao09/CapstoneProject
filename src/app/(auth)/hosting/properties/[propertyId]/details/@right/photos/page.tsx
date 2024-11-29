"use client";
import React from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button, buttonVariants } from "@/components/ui/button";

import { cn } from "@/lib/utils";

import { createClient } from "@/utils/supabase/client";

import { ArrowLeft, Plus } from "lucide-react";

import PhotoUploader from "./_components/photo-uploader";
import LoadingPage from "@/components/LoadingPage";

function PhotosPage({ params }: { params: { propertyId: string } }) {
    const [property, setProperty] = React.useState(null);
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    const supabase = createClient();
    const router = useRouter();
    const lastPayloadRef = React.useRef(null);

    React.useEffect(() => {
        const fetchUser = async () => {
            try {
                const auth = createClient();
                const authenticatedUser = (await (await auth).auth.getUser()).data.user.id;
                setUser(authenticatedUser);
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        fetchUser();
    }, []);

    React.useEffect(() => {
        const fetchProperties = async () => {
            setLoading(true);

            try {
                const channel = supabase
                    .channel("public-property")
                    .on(
                        "postgres_changes",
                        {
                            event: "*",
                            schema: "public",
                            table: "property",
                        },
                        (payload: any) => {
                            if (JSON.stringify(lastPayloadRef.current) !== JSON.stringify(payload)) {
                                lastPayloadRef.current = payload;
                                setProperty((prev) => {
                                    // Merge the new property data with the existing state
                                    return { ...prev, ...payload.new };
                                });
                                router.refresh();
                            }
                        }
                    )
                    .subscribe();

                const { data, error } = await supabase
                    .from("property")
                    .select(`*`).eq("id", params.propertyId).single();

                if (error) {
                    console.error("Error fetching property:", error);
                }

                console.log(data, "property");

                setProperty(data);

                return () => {
                    supabase.removeChannel(channel);
                };
            } catch (error) {
                console.error("Error fetching property:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
        

    }, [params.propertyId, supabase, router]);



    if (loading) {
        return <LoadingPage className="h-[calc(100vh-100px)]" />;
    }
    return (
        <section className="flex flex-col h-[calc(100vh-68px)] w-full px-6 airBnbDesktop:overflow-x-hidden airBnbDesktop:overflow-y-auto airBnbTablet:px-10 min-[1128px]:px-20 airBnbBigDesktop:px-0">
            <header className="airBnbDesktop:mx-auto airBnbDesktop:sticky airBnbDesktop:z-[3] airBnbDesktop:top-0 airBnbDesktop:grow-0 airBnbDesktop:shrink-0 airBnbDesktop:basis-auto airBnbDesktop:pb-5 airBnbDesktop:pt-11 bg-background">
                <div className="flex items-center justify-between w-full px-10 py-6 airBnbDesktop:gap-6 airBnbDesktop:w-[464px] airBnbDesktop:p-0 airBnbBigDesktop:w-[608px] min-[1128px]:w-[512px]">
                    <div className="flex justify-center ">
                        <Link
                            href={`/hosting/properties`}
                            className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full airBnbDesktop:hidden")}
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <h2 className="m-0 p-0 text-[1em]">
                            <span className="p-1 px-0 text-[2rem] leading-9 tracking-[-0.04rem] font-[500]">Photos</span>
                        </h2>
                    </div>
                    <div className="flex items-center gap-2 min-w-[16px] airBnbDesktop:min-w-[auto] airBnbDesktop:ml-auto">
                        <PhotoUploader propertyId={params.propertyId} userId={user?.id} />
                    </div>
                </div>
            </header>
            <div className=" px-6 airBnbDesktop:px-0 min-[1128px]:px-0 py-6 pt-0 grow overflow-y-auto airBnbDesktop:pb-10 airBnbDesktop:overflow-y-visible">
                <div className="airBnbDesktop:mx-auto airBnbBigDesktop:w-[608px] min-[1128px]:w-[512px] airBnbDesktop:w-[464px]">
                    <div className="mb-6 font-normal airBnbDesktop:mb-12">
                        <div className="text-[1rem] leading-5 tracking-normal my-0">
                            Manage photos here. Guests will see these photos when they view your listing.
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 airBnbDesktop:grid-cols-3 airBnbDesktop:gap-4">
                        {property?.property_image && Array.isArray(property.property_image) && property.property_image.length > 0 ? (
                            property.property_image.map((imageUrl: string, index: number) => (
                                <Image
                                    key={index}
                                    src={imageUrl}
                                    alt={`Property image ${index + 1}`}
                                    width={1920}
                                    height={1080}
                                    className="aspect-square object-cover rounded-lg"
                                />
                            ))
                        ) : (
                            <Image
                                src="/placeholderImage.webp"
                                alt="No images available"
                                width={1920}
                                height={1080}
                                className="aspect-square object-cover rounded-lg"
                            />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default PhotosPage;

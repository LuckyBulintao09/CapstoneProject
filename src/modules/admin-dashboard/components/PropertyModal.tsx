import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { createClient } from "@/utils/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const supabase = createClient();

interface PropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  businessPermitUrl: string | null;
  fireInspectionUrl: string | null;
  propertyImageUrls?: string[];
}

const PropertyModal: React.FC<PropertyModalProps> = ({
  isOpen,
  onClose,
  propertyId,
  businessPermitUrl,
  fireInspectionUrl,
  propertyImageUrls = [],
}) => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [zoomImageUrl, setZoomImageUrl] = useState<string | null>(null);
  const [fetchedImages, setFetchedImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchLocation = async () => {
      if (!propertyId) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.rpc("get_property_location", {
          p_id: propertyId,
        });

        if (error) return;

        if (data?.length > 0) {
          const { latitude, longitude } = data[0];
          setLocation({ lat: latitude, lng: longitude });
        }
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) fetchLocation();
  }, [isOpen, propertyId]);

  useEffect(() => {
    const fetchImages = async () => {
      if (!propertyImageUrls?.length) return;

      const accessibleImages: string[] = [];
      for (const url of propertyImageUrls) {
        try {
          const response = await fetch(url);
          if (response.ok) accessibleImages.push(url);
        } catch {}
      }
      setFetchedImages(accessibleImages);
    };

    if (propertyImageUrls?.length) fetchImages();
  }, [propertyImageUrls]);

  const renderDocument = (url: string | null) => {
    if (!url) {
      return <p>No document available</p>;
    }

    const cleanedUrl = url.split("?")[0];
    const fileExtension = cleanedUrl.split(".").pop()?.toLowerCase();
    if (fileExtension === "pdf") {
      return (
        <iframe
          src={url}
          width="100%"
          height="400px"
          style={{ border: "none" }}
        />
      );
    }
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(fileExtension || "")) {
      return (
        <img
          src={url}
          alt="Document"
          className="w-full max-h-[400px] object-contain rounded-lg shadow-md cursor-pointer"
          onClick={() => setZoomImageUrl(url)}
        />
      );
    }
    return <p>Unsupported document type</p>;
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalContent>
          <ModalHeader>Documents</ModalHeader>
          <ModalBody>
            <ScrollArea className="h-[500px] w-full rounded-md overflow-y-auto">
              <div className="p-4">
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Business Permit</h3>
                  {businessPermitUrl ? (
                    renderDocument(businessPermitUrl)
                  ) : (
                    <p className="text-center text-gray-600">
                      No business permit available.
                    </p>
                  )}
                </div>
                <Separator className="my-4" />
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Fire Inspection</h3>
                  {fireInspectionUrl ? (
                    renderDocument(fireInspectionUrl)
                  ) : (
                    <p className="text-center text-gray-600">
                      No fire inspection document available.
                    </p>
                  )}
                </div>
                <Separator className="my-4" />
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Property Images</h3>
                  {fetchedImages.length > 0 ? (
                    <Carousel className="w-full">
                      <CarouselContent>
                        {fetchedImages.map((url, index) => (
                          <CarouselItem key={index}>
                            <img
                              src={url}
                              alt={`Property Image ${index + 1}`}
                              className="w-full max-h-[400px] object-contain rounded-lg shadow-md cursor-pointer"
                              onClick={() => setZoomImageUrl(url)}
                            />
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="text-black w-10 h-10 flex items-center justify-center rounded-full bg-white absolute left-4 top-1/2 transform -translate-y-1/2 shadow-md cursor-pointer" />
                      <CarouselNext className="text-black w-10 h-10 flex items-center justify-center rounded-full bg-white absolute right-4 top-1/2 transform -translate-y-1/2 shadow-md cursor-pointer" />
                    </Carousel>
                  ) : (
                    <p className="text-center text-gray-600">
                      No property images available.
                    </p>
                  )}
                </div>
                <Separator className="my-4" />
                <div>
                  <h3 className="text-lg font-medium mb-2">Map</h3>
                  {location ? (
                    <div className="border h-[400px] w-full rounded-lg overflow-hidden">
                      <GoogleMap
                        mapContainerStyle={{ width: "100%", height: "100%" }}
                        center={location}
                        zoom={15}
                      >
                        <Marker position={location} />
                      </GoogleMap>
                    </div>
                  ) : (
                    <p className="text-center text-gray-600">
                      No location available for this property.
                    </p>
                  )}
                </div>
              </div>
            </ScrollArea>
          </ModalBody>
        </ModalContent>
      </Modal>

      {zoomImageUrl && (
        <Modal
          isOpen={!!zoomImageUrl}
          onClose={() => setZoomImageUrl(null)}
          size="full"
        >
          <ModalContent>
            <ModalBody>
              <div
                className="flex justify-center items-center h-full"
                onDoubleClick={() => setZoomImageUrl(null)}
              >
                <img
                  src={zoomImageUrl}
                  alt="Zoomed Document"
                  className="max-w-full max-h-full object-contain cursor-pointer"
                />
              </div>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default PropertyModal;

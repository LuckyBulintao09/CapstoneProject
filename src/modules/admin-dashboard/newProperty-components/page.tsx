"use client";
import React, { useEffect, useState } from "react";
import { DataTable } from "@/components/table/data-table";
import { columns, PropertyListing } from "./column";
import { createClient } from "@/utils/supabase/client";
import { expirePropertiesFunction } from "@/actions/admin/expirePropertiesFunction";
import { format } from "date-fns";

const supabase = createClient();

interface PropertyListingsDashboardProps {
  isLoaded: boolean;
  onCountUpdate?: (count: number) => void;
}

const PropertyListingsDashboard: React.FC<PropertyListingsDashboardProps> = ({
  isLoaded,
  onCountUpdate,
}) => {
  const [data, setData] = useState<PropertyListing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPropertyListings = async () => {
    try {
      const { data: fetchedListings, error } = await supabase
        .from("property")
        .select(`
          id,
          title,
          company:company (
            company_name,
            owner:owner_id (
              firstname,
              lastname,
              id
            )
          ),
          business_permit,
          fire_inspection,
          created_at,
          isApproved,
          due_date,
          updated_at
        `)
        .in("isApproved", ["pending", "approved", "rejected"])
        .order("isApproved", {
          ascending: false,
        })
        .order("isApproved", {
          ascending: true,
          nullsFirst: true,
        })

      if (error) {
        console.error("Error fetching property listings:", error);
        return [];
      }

      return (
        fetchedListings?.map((listing) => ({
          id: listing.id,
          ownerId: listing.company?.owner?.id || "",
          company_name: listing.company?.company_name || "N/A",
          proprietor_name: listing.company?.owner
            ? `${listing.company.owner.firstname} ${listing.company.owner.lastname}`
            : "N/A",
          property_title: listing.title,
          businessPermitUrl: listing.business_permit,
          fireInspectionUrl: listing.fire_inspection,
          createdAt: listing.created_at
            ? format(new Date(listing.created_at), "MMMM dd, yyyy")
            : "",
          dueDate: listing.due_date
            ? format(new Date(listing.due_date), "MMMM dd, yyyy")
            : "N/A",
          isApproved: listing.isApproved,
          updatedAt: listing.updated_at
            ? format(new Date(listing.updated_at), "MMMM dd, yyyy")
            : "",
        })) || []
      );
    } catch (error) {
      console.error("Unexpected error:", error);
      return [];
    }
  };

  const handlePropertyUpdate = async (
    propertyId: string,
    isApproved: any,
  ) => {
    try {
      const updates: {
        isApproved: any;
        due_date?: string | null;
      } = {
        isApproved
      };

      if (isApproved === "approved") {
        const dueDate = new Date();
        dueDate.setFullYear(dueDate.getFullYear() + 2);
        updates.due_date = dueDate.toISOString().slice(0, 10); 


      } else {
        updates.due_date = null;
      }

      console.log("Updates being sent to Supabase:", updates);

      const { error } = await supabase
        .from("property")
        .update(updates)
        .eq("id", propertyId);

      if (error) {
        console.error("Error updating property status:", error);
        return;
      }

      const updatedProperty = await fetchUpdatedProperty(propertyId);
      if (updatedProperty) {
        setData((prevData) =>
          prevData.map((listing) =>
            listing.id === propertyId ? updatedProperty : listing
          )
        );
      }
    } catch (error) {
      console.error("Error handling property update:", error);
    }
  };

  const fetchUpdatedProperty = async (propertyId: string) => {
    try {
      const { data: updatedProperty, error } = await supabase
        .from("property")
        .select(
          `
          id,
          title,
          company:company (
            company_name,
            owner:owner_id (
              firstname,
              lastname,
              id
            )
          ),
          business_permit,
          fire_inspection,
          created_at,
          isApproved,
          due_date,
          updated_at
        `
        )
        .eq("id", propertyId)
        .single();

      if (error) {
        console.error("Error fetching updated property:", error);
        return null;
      }

      return {
        id: updatedProperty.id,
        ownerId: updatedProperty.company?.owner?.id || "",
        company_name: updatedProperty.company?.company_name || "N/A",
        proprietor_name: updatedProperty.company?.owner
          ? `${updatedProperty.company.owner.firstname} ${updatedProperty.company.owner.lastname}`
          : "N/A",
        property_title: updatedProperty.title,
        businessPermitUrl: updatedProperty.business_permit,
        fireInspectionUrl: updatedProperty.fire_inspection,
        createdAt: updatedProperty.created_at
          ? format(new Date(updatedProperty.created_at), "MMMM dd, yyyy")
          : "",
        dueDate: updatedProperty.due_date
          ? format(new Date(updatedProperty.due_date), "MMMM dd, yyyy")
          : "N/A",
        isApproved: updatedProperty.isApproved,
        updatedAt: updatedProperty.updated_at
          ? format(new Date(updatedProperty.updated_at), "MMMM dd, yyyy")
          : "",
      };
    } catch (error) {
      console.error("Error fetching updated property:", error);
      return null;
    }
  };

  useEffect(() => {
    if (!isLoaded) return;

    const loadData = async () => {
      setLoading(true);
      try {
        await expirePropertiesFunction();
        const formattedListings = await fetchPropertyListings();
        setData(formattedListings);
        onCountUpdate?.(formattedListings.length);
      } catch (error) {
        console.error("Failed to load properties:", error.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isLoaded]);

  return (
    <DataTable
      columns={columns(handlePropertyUpdate)}
      data={data}
      loading={loading}
      className="flex-1 overflow-y-auto"
    />
  );
};

export default PropertyListingsDashboard;

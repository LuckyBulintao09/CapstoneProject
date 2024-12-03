"use client";

import { useEffect, useState } from "react";
import ReviewsUnderCompany from "@/modules/property/components/ReviewsUnderCompany";
import { createClient } from "@/utils/supabase/client"; 
const supabase = createClient();

function Reviews() {
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserAndCompany() {
      try {
        setLoading(true);
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError) throw new Error(`Error fetching user: ${userError.message}`);
        if (!user?.id) throw new Error("Authenticated user not found");

        const userId = user.id;
        const { data: companyData, error: companyError } = await supabase
          .from("company")
          .select("id")
          .eq("owner_id", userId)
          .single();

        if (companyError) throw new Error(`Error fetching company: ${companyError.message}`);
        if (!companyData?.id) throw new Error("No company associated with this user");

        setCompanyId(companyData.id);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUserAndCompany();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {companyId && <ReviewsUnderCompany companyId={companyId} />}
    </div>
  );
}

export default Reviews;

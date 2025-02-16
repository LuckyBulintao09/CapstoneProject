import { createClient } from "@/utils/supabase/client";
import { addAnalytics} from "../analytics/companyVisit";
import { getAnalytics } from "../analytics/getCompanyAnalytics";
const supabase = createClient();

export const getSpecificCompany = async (id: number) => {
    let { data: company, error: companyError } = await supabase
        .from("company")
        .select("created_at, company_name, about, address, owner_id, id")
        .eq("id", id)
        .single();

    if (companyError) {
        console.error(companyError);
        throw companyError;
    }

    let { data: owner, error: ownerError } = await supabase
        .from("account")
        .select("firstname, lastname, email, cp_number, id,profile_url")
        .eq("id", company?.owner_id)
        .single();

    if (ownerError) {
        console.error(ownerError);
        throw ownerError;
    }

    await addAnalytics(id);
    // await getAnalytics(id);
    return { company, owner };
};

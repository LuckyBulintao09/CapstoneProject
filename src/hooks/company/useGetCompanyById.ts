
import { getCompanyById } from "@/actions/company/getCompanyById";
import { useQuery } from "@tanstack/react-query";

export default function useGetCompanyById(user_id: string, company_id: string) {
    return useQuery({
        queryKey: ['company', user_id, company_id],
        queryFn: () => getCompanyById(user_id, company_id),
        enabled: !!user_id && !!company_id,
    });
};

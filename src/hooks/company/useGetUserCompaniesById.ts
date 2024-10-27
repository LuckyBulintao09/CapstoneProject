
import { getUserCompaniesById } from "@/actions/company/getUserCompaniesById";
import { useQuery } from "@tanstack/react-query";

export default function useGetUserCompaniesById(id: string) {
    return useQuery({
        queryKey: ["user", id],
        queryFn: () => getUserCompaniesById(id),
        enabled: !!id,
    });
};

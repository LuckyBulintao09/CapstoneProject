"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { companySchema } from "@/lib/schemas/createCompanySchema";

function AddCompanyForm() {
    const createCompanyForm = useForm<z.infer<typeof companySchema>>({
        resolver: zodResolver(companySchema),
    });

    function onSubmit(values: z.infer<typeof companySchema>) {}

    return <div>AddCompanyForm</div>;
}

export default AddCompanyForm;

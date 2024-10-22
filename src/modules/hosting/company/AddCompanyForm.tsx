"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { companySchema, CompanySchemaTypes } from "@/lib/schemas/createCompanySchema";
import { BasicUploaderDemo } from "./basic-uploader-demo";

function AddCompanyForm() {
    const createCompanyForm = useForm<CompanySchemaTypes>({
        resolver: zodResolver(companySchema),
    });

    function onSubmit(values: CompanySchemaTypes) {
        console.log(values);
    }

    return <div>
        <BasicUploaderDemo />
    </div>;
}

export default AddCompanyForm;

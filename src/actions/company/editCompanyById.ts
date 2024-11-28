"use server"

import { EditCompanySchemaTypes } from "@/lib/schemas/createCompanySchema"
import { createClient } from "@/utils/supabase/server"

export const editCompanyById = async (userId: string, companyId: string, formData: EditCompanySchemaTypes) => {
    const supabase = createClient()

    try {
        
        const {error} = await supabase.from('company').update({ 
            company_name: formData.company_name,
            about: formData.about,
         }).eq('owner_id', userId).eq('id', companyId).select()

        if (error?.code) {
            return error
        }
        console.log(formData)


    } catch (error: any) {

        return error

    }
}

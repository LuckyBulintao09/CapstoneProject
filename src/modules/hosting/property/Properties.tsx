"use client";

import React from "react";

import PropertiesTable from "./PropertiesTable/PropertiesTable";

import { columns } from "./PropertiesTable/columns";

import { createClient } from "@/utils/supabase/client";

import { useRouter } from "next/navigation";

import { PropertyViewModeContext } from "./PropertyViewModeProvider";
import PropertiesCard from "./PropertiesCard";

function Properties({ data }: any) {
    const supabase = createClient();
    const router = useRouter();
    const lastPayloadRef = React.useRef(null);
    
    React.useEffect(() => {
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
                        router.refresh();
                    }
                }
            )
            .subscribe();
            
        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase, router]);


    const { viewMode } = React.useContext(PropertyViewModeContext);
    if (viewMode === "grid") {
        return <PropertiesCard data={data} columns={columns} />;
    }
    return <PropertiesTable data={data} columns={columns} />;
}

export default Properties;

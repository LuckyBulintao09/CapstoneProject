"use client";

import React from "react";

import PropertiesTable from "./PropertiesTable/PropertiesTable";

import { columns } from "./PropertiesTable/columns";

import { PropertyViewModeContext } from "./PropertyViewModeProvider";
import PropertiesCard from "./PropertiesCard";

function Properties({ data }: any) {
    const { viewMode } = React.useContext(PropertyViewModeContext);
    if (viewMode === "grid") {
        return <PropertiesCard data={data} columns={columns} />;
    }
    return <PropertiesTable data={data} columns={columns} />;
}

export default Properties;

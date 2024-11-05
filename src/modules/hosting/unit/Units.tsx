"use client";

import React from "react";

import UnitsTable from "./UnitTable/UnitsTable";

import { columns } from "./UnitTable/columns";

import { UnitViewModeContext } from "./UnitViewModeProvider";

import UnitsCard from "./UnitsCard";

// import PropertiesCard from "./PropertiesCard";

function Units({ data }: any) {
    const { viewMode } = React.useContext(UnitViewModeContext);
    if (viewMode === "grid") {
        return <UnitsCard data={data} columns={columns} />;
    }
    return <UnitsTable data={data} columns={columns} />;
}

export default Units;

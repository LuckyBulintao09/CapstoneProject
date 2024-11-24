import React from "react";

// import { UnitViewModeProvider } from "@/modules/hosting/unit/UnitViewModeProvider";
// import Units from "@/modules/hosting/unit/Units";

// import { getAuthenticatedUser } from "@/utils/supabase/server";
// import { getUnitsUnderCompanyProperty } from "@/actions/unit/getUnitsUnderCompanyProperty";

async function UnitPage() {
    // const user = await getAuthenticatedUser();

    // if (!user) {
    //   return null;
    // }

    // const units = await getUnitsUnderCompanyProperty(user.id);
    // console.log(units)

    return (
        // <UnitViewModeProvider>
        //     <div className="container mx-auto">
        //         {/* <Units data={units} /> */}
        //         Units here
        //     </div>
        // </UnitViewModeProvider>
        <div className="container mx-auto">
                {/* <Units data={units} /> */}
                Units here
            </div>
    );
}

export default UnitPage;

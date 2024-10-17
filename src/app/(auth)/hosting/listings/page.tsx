"use server"

import { getFavoritesById } from "@/actions/favorites/get-favorites-by-id";
import { getAllProperties } from "@/actions/property/get-all-properties";
import ListingsContent from "@/modules/hosting/listings/ListingsContent";
import React from "react";

async function Listings() {
    const data = await getAllProperties();
    const favorites = await getFavoritesById("01967c5e-538d-4563-be5e-ed57596b9767");
    return (
        <div>
            {/* add client component later */}
            <ListingsContent data={data} favorites={favorites} />
        </div>
    );
}

export default Listings;

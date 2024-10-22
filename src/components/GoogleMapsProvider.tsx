"use client"

import { APIProvider } from "@vis.gl/react-google-maps";
import React from "react";

function GoogleMapsProvider({ children, google_maps_api_key, ...props }: { children: React.ReactNode, google_maps_api_key: string }) {
    return <APIProvider apiKey={google_maps_api_key} {...props}>{children}</APIProvider>;
}

export default GoogleMapsProvider;

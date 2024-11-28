"use client";

import React from 'react'

import { Map, MapCameraChangedEvent, MapCameraProps, Marker, useMapsLibrary } from "@vis.gl/react-google-maps";
import { cn } from '@/lib/utils';

function MapLocation({className, location} : {className?: string, location: {latitude: number | any, longitude: number | any}}) {
  return (
      <Map
          gestureHandling={"none"}
          disableDefaultUI={true}
          zoomControl={false}
          className={cn("w-full h-[300px]", className)}
          zoom={20}
          center={{ lat: location.latitude, lng: location.longitude }}
      >
          <Marker position={{ lat: location.latitude, lng: location.longitude }} />
      </Map>
  );
}

export default MapLocation
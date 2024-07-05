"use client";

import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useEffect, useState } from "react";
import useGetCoordinatesByLocation from "@/hooks/api/address/useGetCoordinatesByLocation";

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
});

const Map = ({
  city,
  province,
  onLocationSelect,
}: {
  city: string;
  province: string;
  onLocationSelect: (locationData: any) => void;
}) => {
  const [currentPosition, setCurrentPosition] = useState<
    [number, number] | null
  >(null);
  const { getCoordinates, data: coordinatesData } =
    useGetCoordinatesByLocation();

  useEffect(() => {
    if (city && province) {
      getCoordinates(city, province);
    }
  }, [city, province]);

  useEffect(() => {
    if (coordinatesData) {
      const { lat, lng } = coordinatesData;
      setCurrentPosition([lat, lng]);
      onLocationSelect({ lat: lat, long: lng });
    }
  }, [coordinatesData]);

  const handleDragEnd = (event: L.LeafletEvent) => {
    const marker = event.target as L.Marker;
    const position = marker.getLatLng();
    setCurrentPosition([position.lat, position.lng]);
    onLocationSelect({ lat: position.lat, long: position.lng });
  };

  const MapUpdater = () => {
    const map = useMap();

    useEffect(() => {
      if (currentPosition) {
        map.setView(currentPosition, map.getZoom());
      }
    }, [currentPosition]);

    return null;
  };

  return (
    <div className="h-96">
      {currentPosition && (
        <MapContainer
          center={currentPosition}
          zoom={15}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {currentPosition && (
            <Marker
              position={currentPosition}
              draggable={true}
              eventHandlers={{
                dragend: handleDragEnd,
              }}
            >
              <Popup>Drag me to change location.</Popup>
            </Marker>
          )}
          <MapUpdater />
        </MapContainer>
      )}
    </div>
  );
};

export default Map;

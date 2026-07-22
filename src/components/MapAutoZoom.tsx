import {useEffect} from 'react';
import {useMap} from 'react-leaflet';
import L from 'leaflet';
import type {FeatureCollection} from "geojson";

interface MapAutoZoomProps {
    activities?: FeatureCollection,
    cities?: FeatureCollection;
    parks?: FeatureCollection;
}

export function MapAutoZoom({activities, cities, parks}: MapAutoZoomProps) {
    const map = useMap();

    useEffect(() => {
            const bounds = L.latLngBounds([]);

            if (activities) {
                const layer = L.geoJSON(activities);
                bounds.extend(layer.getBounds());
            }
            if (cities) {
                const layer = L.geoJSON(cities);
                bounds.extend(layer.getBounds());
            }
            if (parks) {
                const layer = L.geoJSON(parks);
                bounds.extend(layer.getBounds());
            }

            if (bounds.isValid()) {
                map.fitBounds(bounds, {
                    padding: [24, 25],
                    maxZoom: 17
                });
            }

        },
        [activities, cities, parks, map]
    )

    return null;
}
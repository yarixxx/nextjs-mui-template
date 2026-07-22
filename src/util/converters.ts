import {FeatureCollection, Geometry} from "geojson";
import {gpx} from "@tmcw/togeojson";

type RawFeatureRow = {
    id: string;
    geometry: Geometry;
    properties: Record<string, any>;
}

type RawActivityData = {
    streets: RawStreet[];
    activityType: string;
    distance: number;
}

type RawStreet = {
    osm: string;
    name: string;
    city: string | null;
    city_id: string | null;
    park: string | null;
    park_id: string | null;
};

type AiCity = {
    name: string;
    streets: string[];
};

type AiPark = {
    name: string;
    trails: string[];
};

export type AiSummaryInput = {
    activityType: string;
    activityDistance: string;
    summary: {
        totalCities: number;
        totalParks: number;
    };
    cities: AiCity[];
    parks: AiPark[];
};

export function buildAiSummaryInput(
    data: RawActivityData
): AiSummaryInput {
    const cities = new Map<string, Set<string>>();
    const parks = new Map<string, Set<string>>();

    for (const row of data.streets) {
        if (row.city) {
            if (!cities.has(row.city)) {
                cities.set(row.city, new Set());
            }

            cities.get(row.city)!.add(row.name);
        }

        if (row.park) {
            if (!parks.has(row.park)) {
                parks.set(row.park, new Set());
            }

            parks.get(row.park)!.add(row.name);
        }
    }

    return {
        activityType: data.activityType,
        activityDistance: `(${data.distance} / 1000).toFixed(2)} km`,
        summary: {
            totalCities: [...cities.entries()].length,
            totalParks: [...parks.entries()].length,
        },
        cities: [...cities.entries()].map(([name, streets]) => ({
            name,
            streetCount: [...streets].length,
            streets: [...streets],
        })),
        parks: [...parks.entries()].map(([name, trails]) => ({
            name,
            trailsCount: [...trails].length,
            trails: [...trails],
        })),
    };
}

export function convertToGeoJson(data: RawFeatureRow[]): FeatureCollection {
    const jsons =  (data ? data : []).map((row: RawFeatureRow) => {
        const {id, geometry, ...properties} = row;

        return {
            type: 'Feature' as const,
            id,
            geometry,
            properties
        };
    });
    return {
        type: "FeatureCollection" as const,
            features: jsons ?? [],
    }
}

export async function fileToGpx(file: File) {
    const text = await file.text();
    const xml = new DOMParser().parseFromString(text, "text/xml");
    return gpx(xml);
}
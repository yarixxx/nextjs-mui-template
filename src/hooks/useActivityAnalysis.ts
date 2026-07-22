"use client";

import {useState} from "react";
import {fileToGpx} from "@/src/util/converters";
import {
    claimCities,
    claimParks,
    claimSegments,
    uploadActivityAction
} from "@/src/services/activities";
import type {
    Feature,
    FeatureCollection
} from "geojson";
import {generateShortActivitySummary} from "@/src/services/ai";

export function useActivityAnalysis() {
    const [summary, setSummary] = useState("");
    const [stagedActivities, setStagedActivities] =
        useState<Feature[]>([]);

    async function analyzeActivities(
        collection: FeatureCollection
    ) {

        const activities = collection.features.map(feature => ({
            ...feature,
            id: crypto.randomUUID()
        }));

        const ids = await uploadActivityAction(activities);

        return await Promise.all(
            ids.map(async id => {

                const [
                    parks,
                    cities,
                    segments
                ] = await Promise.all([
                    claimParks(id),
                    claimCities(id),
                    claimSegments(id),
                ]);

                return {
                    parks,
                    cities,
                    segments
                };
            })
        );
    }


    async function processFiles(files: File[]) {
        const collections = await Promise.all(
            files.map(fileToGpx)
        );
        const allStats = [];

        for (const collection of collections) {
            const stats = await analyzeActivities(collection);
            allStats.push(...stats);
        }

        setStagedActivities(
            collections.flatMap(
                c => c.features
            )
        );

        const summary = await generateShortActivitySummary(allStats);

        setSummary(summary);
    }

    return {
        stagedActivities,
        summary,
        processFiles,
    };
}
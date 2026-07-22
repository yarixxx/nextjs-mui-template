import * as React from "react";
import {CircularProgress} from "@mui/material";
import {useMemo} from "react";
import dynamic from "next/dynamic";
import useSWR from "swr";
import {
    allActivitiesFetcher,
    getAllVisitedCitiesShapes,
    getAllVisitedParks
} from "@/src/services/activities";

const MapComponent = dynamic(
    () =>
        import('@/src/components/MapComponent'), {ssr: false});

export function SummaryMapStep() {
    const {
        data: cities,
        isLoading: isCitiesLoading
    } = useSWR(['getAllVisitedCitiesShapes'], () => getAllVisitedCitiesShapes());
    const {
        data: parks,
        isLoading: isParksLoading
    } = useSWR(['getAllVisitedParks'], () => getAllVisitedParks());
    const {
        data: activities,
        isLoading: isActivitiesLoading
    } = useSWR(['allActivitiesFetcher'], () => allActivitiesFetcher());

    const activitiesCollection = useMemo(
        () => ({
            type: "FeatureCollection" as const,
            features: activities ?? [],
        }),
        [activities]
    );

    const parksCollection = useMemo(
        () => ({
            type: "FeatureCollection" as const,
            features: parks ?? [],
        }),
        [parks]
    );

    const citiesCollection = useMemo(
        () => ({
            type: "FeatureCollection" as const,
            features: cities ?? [],
        }),
        [cities]
    );

    return <section>
        All activities, parks and cities.
        {isCitiesLoading || isParksLoading || isActivitiesLoading ? <CircularProgress/> : <MapComponent
            activities={activitiesCollection}
            cities={citiesCollection}
            parks={parksCollection}
            location={[37.38, -122.08]}/>}
    </section>
}
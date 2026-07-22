"use client";

import * as React from "react";
import {statsResultsFetcher} from "@/src/services/activities";
import Dashboard from "@/src/components/Dashboard";
import useSWR from "swr";
import { CircularProgress } from "@mui/material";

export function AnalysisStep() {
    const {data, isLoading} = useSWR(
        ['statsResultsFetcher'],
        () => statsResultsFetcher(),
        {keepPreviousData: true},
    );

    return <section>
        {isLoading && <CircularProgress />}
        {data && <Dashboard
            totalScore={data.segments}
            completedParks={data.completedParks}
            visitedCities={data.visitedCities}
            segments={data.segments}
            trails={data.trails}
            visitedParks={data.visitedParks}
            isLoading={isLoading}/>}
    </section>
}
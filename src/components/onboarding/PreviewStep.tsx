import * as React from "react";
import type {FeatureCollection} from "geojson";
import {Paper, Typography} from "@mui/material";
import {Suspense} from "react";
import dynamic from "next/dynamic";

const MapComponent = dynamic(
    () =>
        import('@/src/components/MapComponent'), {ssr: false});

interface PreviewStepProps {
    activities: FeatureCollection,
    summary: string
}

export function PreviewStep({activities, summary}: PreviewStepProps) {
    return <Paper
        elevation={3}
        sx={{
            height: 500,
            width: 500,
            mt: 2,
            overflow: "hidden",

            "& .leaflet-container": {
                height: "100%",
                width: "100%",
            },
        }}
    >
        {activities.features.length === 0 && <Typography color="text.secondary">
            No activities uploaded.
        </Typography>}
        {summary && <Typography color="text.secondary">
            AI Summary: {summary}
        </Typography>}
        <Suspense fallback={<div>Loading...</div>}>
            {activities && <MapComponent
                key={activities.features.length}
                location={[37.38, -122.08]}
                activities={activities}/>}
        </Suspense>
    </Paper>
}
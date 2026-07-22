import {
    Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle,
} from "@mui/material";
import React from "react";
import useSWR from "swr";
import {getActivity, getActivityCities, getActivityParks} from "@/src/services/activities";
import dynamic from "next/dynamic";
import {convertToGeoJson} from "@/src/util/converters";

const MapComponent = dynamic(
    () =>
        import('@/src/components/MapComponent'), {ssr: false});

type ActivityMapDialogProps = {
    activityId: string;
    open: boolean;
    onClose: () => void;
};

export function ActivityMapDialog({activityId, open, onClose}: ActivityMapDialogProps) {
    const {data: combinedData, isLoading} = useSWR(
        activityId ? ['getActivityDetails', activityId] : null,
        async () => {
            const [activity, parks, cities] = await Promise.all([
                getActivity(activityId!),
                getActivityParks(activityId!),
                getActivityCities(activityId!),
            ]);

            return {
                activities: convertToGeoJson(activity),
                parks: parks ? convertToGeoJson(parks) : undefined,
                cities: cities ? convertToGeoJson(cities) : undefined,
            };
        },
        {keepPreviousData: false}
    );

    // Destructure the pre-computed, pre-cached GeoJSON data directly
    const {activities, parks, cities} = combinedData || {};

    return <Dialog
        open={open}
        onClose={onClose}
        fullWidth={true}
        maxWidth="md"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
    >
        <DialogTitle id="scroll-dialog-title">Activity Map</DialogTitle>
        <DialogContent dividers={true}>
            {isLoading ? <CircularProgress /> : <MapComponent
                activities={activities}
                parks={parks}
                cities={cities}
                location={[37.38, -122.08]}/>}
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Close</Button>
        </DialogActions>
    </Dialog>
}
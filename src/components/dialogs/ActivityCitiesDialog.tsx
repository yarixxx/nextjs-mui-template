import React from "react";
import useSWR from "swr";
import {getActivityCities} from "@/src/services/activities";
import {ActivityDialog} from "@/src/components/dialogs/ActivityDialog";

type ActivityCitiesDialogProps = {
    activityId: string;
    open: boolean;
    onClose: () => void;
};

export function ActivityCitiesDialog({activityId, open, onClose}: ActivityCitiesDialogProps) {
    const {data: cities, isLoading} = useSWR(
        ['getActivityCities', activityId],
        () => getActivityCities(activityId),
        {keepPreviousData: false},
    );

    return <ActivityDialog
        icon="city"
        open={open}
        isLoading={isLoading}
        onClose={onClose}
        title="Visited Cities"
        items={cities}/>
}
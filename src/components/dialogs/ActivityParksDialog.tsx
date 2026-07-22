import React from "react";
import useSWR from "swr";
import {getActivityParks} from "@/src/services/activities";
import {ActivityDialog} from "@/src/components/dialogs/ActivityDialog";

type ActivityParksDialogProps = {
    activityId: string;
    open: boolean;
    onClose: () => void;
};

export function ActivityParksDialog({activityId, open, onClose}: ActivityParksDialogProps) {
    const {data: parks, isLoading} = useSWR(
        ['getActivityParks', activityId],
        () => getActivityParks(activityId),
        {keepPreviousData: false},
    );

    return <ActivityDialog
        icon={'park'}
        open={open}
        isLoading={isLoading}
        onClose={onClose}
        title="Visited Parks"
        items={parks}/>
}
import React from "react";
import useSWR from "swr";
import {getActivityDetails} from "@/src/services/activities";
import {ActivityDialog} from "@/src/components/dialogs/ActivityDialog";

type ActivityStreetsDialogProps = {
    activityId: string;
    open: boolean;
    onClose: () => void;
};

export function ActivityStreetsDialog({activityId, open, onClose}: ActivityStreetsDialogProps) {
    const {data: activity, isLoading} = useSWR(
        ['activitiesFetcher', activityId],
        () => getActivityDetails(activityId),
        {keepPreviousData: false},
    );
    const streets = new Set<string>(
        activity
            ? activity.streets.map((street: { id: string, name: string, park: string, city: string }) => {
                const title =
                    street.name ??
                    street.park ??
                    "Unknown path";

                const parts = [
                    title,
                    street.name ? street.park : undefined,
                    street.city ?? (!street.park ? "Unincorporated area" : undefined),
                ];

                return parts.filter(Boolean).join(", ");
            })
            : []
    );
    const idStreets = [...streets].map((s: string) => {
        return {id: s, name: s}
    });

    return <ActivityDialog
        icon="segment"
        open={open}
        onClose={onClose}
        title="Visited Trails and Streets"
        items={idStreets}
        isLoading={isLoading}/>
}
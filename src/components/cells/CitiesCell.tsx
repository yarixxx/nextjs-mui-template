import {useState} from "react";
import {ActivityCitiesDialog} from "@/src/components/dialogs/ActivityCitiesDialog";
import {Chip} from "@mui/material";

type ActivityCellProps = {
    activityId: string;
    count: number;
};

export function CitiesCell({activityId, count}: ActivityCellProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Chip
                onClick={() => setOpen(true)}
                color="primary"
                disabled={count === 0}
                label={count}
                sx={{
                    fontWeight: 700,
                }}
            />

            <ActivityCitiesDialog
                activityId={activityId}
                open={open}
                onClose={() => setOpen(false)}
            />
        </>
    );
}
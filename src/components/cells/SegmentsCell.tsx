import {useState} from "react";
import {ActivityStreetsDialog} from "@/src/components/dialogs/ActivityStreetsDialog";
import {Chip} from "@mui/material";

type ActivityCellProps = {
    activityId: string;
    count: number;
};

export function SegmentsCell({ activityId, count }: ActivityCellProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Chip
                onClick={() => setOpen(true)}
                color="error"
                disabled={count === 0}
                label={count}
                sx={{
                    fontWeight: 700,
                }}
            />

            <ActivityStreetsDialog
                activityId={activityId}
                open={open}
                onClose={() => setOpen(false)}
            />
        </>
    );
}
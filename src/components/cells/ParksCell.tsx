import {useState} from "react";
import {ActivityParksDialog} from "@/src/components/dialogs/ActivityParksDialog";
import {Chip} from "@mui/material";

type ActivityCellProps = {
    activityId: string;
    count: number;
};

export function ParksCell({ activityId, count }: ActivityCellProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Chip
                onClick={() => setOpen(true)}
                color="success"
                disabled={count === 0}
                label={count}
                sx={{
                    fontWeight: 700,
                }}
            />

            <ActivityParksDialog
                activityId={activityId}
                open={open}
                onClose={() => setOpen(false)}
            />
        </>
    );
}
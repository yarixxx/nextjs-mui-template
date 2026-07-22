import {useState} from "react";
import Button from "@mui/material/Button";
import {ActivityMapDialog} from "@/src/components/dialogs/ActivityMapDialog";

type ShowMapCellProps = {
    activityId: string;
};

export function ShowMapCell({ activityId }: ShowMapCellProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button
                color="primary"
                onClick={() => setOpen(true)}
            >
                Show Map
            </Button>

            <ActivityMapDialog
                activityId={activityId}
                open={open}
                onClose={() => setOpen(false)}
            />
        </>
    );
}
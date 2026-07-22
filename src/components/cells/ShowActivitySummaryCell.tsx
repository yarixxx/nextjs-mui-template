import React, {useState} from "react";
import Button from "@mui/material/Button";
import {AiSummaryDialog} from "@/src/components/dialogs/AiSummaryDialog";

type ShowActivitySummaryProps = {
    activityId: string;
};

export function ShowActivitySummaryCell({ activityId }: ShowActivitySummaryProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button onClick={() => setOpen(true)}>Show Ai Summary</Button>
            {open && <AiSummaryDialog
                activityId={activityId}
                open={open}
                onClose={() => setOpen(false)}
            />
            }
        </>
    );
}
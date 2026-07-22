import React from "react";
import useSWR from "swr";
import {getActivityDetailsForAi} from "@/src/services/activities";
import {Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";

type ActivityStreetsDialogProps = {
    activityId: string;
    open: boolean;
    onClose: () => void;
};

export function AiSummaryDialog({activityId, onClose, open}: ActivityStreetsDialogProps) {
    const {data: summary, isLoading} = useSWR(
        ['getActivityDetailsForAi', activityId],
        () => getActivityDetailsForAi(activityId),
        {keepPreviousData: false},
    );

    console.log('activity', summary);

    return <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
    >
        <DialogTitle id="scroll-dialog-title">Ai Summary</DialogTitle>
        <DialogContent dividers={true}>
            {isLoading ? <CircularProgress/> : summary}
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Close</Button>
        </DialogActions>
    </Dialog>
}
import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import {mutate as mutateGlobal} from "swr";
import {deleteActivity} from "@/src/services/activities";

type DeleteActivityButtonProps = {
    activityId: string;
    activityName?: string | null;
    onDeleted?: () => Promise<unknown> | unknown;
};

export default function DeleteActivityButton({
                                                 activityId,
                                                 activityName,
                                                 onDeleted,
                                             }: DeleteActivityButtonProps) {
    const [open, setOpen] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);

    async function handleConfirmDelete() {
        setIsDeleting(true);

        try {
            await deleteActivity(activityId);
            await onDeleted?.();
            await mutateGlobal('activitiesFetcherShort');
            setOpen(false);
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                variant="outlined"
                color="error"
                size="small"
                disabled={isDeleting}
            >
                Delete
            </Button>

            <Dialog
                open={open}
                onClose={() => {
                    if (!isDeleting) {
                        setOpen(false);
                    }
                }}
            >
                <DialogTitle>Delete activity?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        This will permanently delete
                        {activityName ? ` "${activityName}"` : ' this activity'} and remove related claimed visits.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setOpen(false)}
                        disabled={isDeleting}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        color="error"
                        variant="contained"
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete Activity'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
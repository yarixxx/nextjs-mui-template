import React, {useState} from "react";
import {CompletionFilter} from "@/src/services/activities";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
} from "@mui/material";
import TrailsTable from "@/src/components/tables/TrailsTable";

type TrailsDialogProps = {
    filter: CompletionFilter
};

export function TrailsDialog({filter}: TrailsDialogProps) {
    const [open, setOpen] = useState(false);

    function handleClickOpen() {
        setOpen(true);
    }

    function handleClose() {
        setOpen(false);
    }

    return <>
        <Button onClick={handleClickOpen}>Show details</Button>
        {open && <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
        >
            <DialogTitle id="scroll-dialog-title">Trails</DialogTitle>
            <DialogContent dividers={true}>
                <List dense disablePadding>
                    <TrailsTable filter={filter}/>
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Close</Button>
            </DialogActions>
        </Dialog>}
    </>
}
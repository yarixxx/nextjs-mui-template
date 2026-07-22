import React, {useState} from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
} from "@mui/material";
import VisitedParksTable from "@/src/components/tables/VisitedParksTable";
import {CompletionFilter} from "@/src/services/activities";

type VisitedParksDialogProps = {
    filter: CompletionFilter;
};

export function VisitedParksDialog({filter}: VisitedParksDialogProps) {
    const [open, setOpen] = useState(false);

    function handleClickOpen() {
        setOpen(true);
    }

    function handleClose() {
        setOpen(false);
    }

    return <>
        <Button onClick={handleClickOpen}>Show details Park</Button>
        {open && <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
        >
            <DialogTitle id="scroll-dialog-title">All Visites Parks</DialogTitle>
            <DialogContent dividers={true}>
                <List dense disablePadding>
                    <VisitedParksTable filter={filter}/>
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Close</Button>
            </DialogActions>
        </Dialog>}
    </>
}
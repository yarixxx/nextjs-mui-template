import React, {useState} from "react";
import {CompletionFilter} from "@/src/services/activities";
import CitiesTable from "@/src/components/tables/VisitedCitiesTable";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
} from "@mui/material";

type VisitedCitiesDialogProps = {
    filter: CompletionFilter;
};

export function VisitedCitiesDialog({filter}: VisitedCitiesDialogProps) {
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
            <DialogTitle id="scroll-dialog-title">All Visites Cities</DialogTitle>
            <DialogContent dividers={true}>
                <List dense disablePadding>
                    <CitiesTable filter={filter}/>
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Close</Button>
            </DialogActions>
        </Dialog>}
    </>
}
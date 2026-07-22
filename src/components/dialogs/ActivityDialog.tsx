import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from "@mui/material";
import RouteIcon from "@mui/icons-material/Route";
import React from "react";
import MaterialIcon from "@/src/components/MaterialIcon";

type ActivityDialogProps = {
    title: string;
    open: boolean;
    isLoading: boolean;
    onClose: () => void;
    items: { id: string, name: string }[];
    icon: any;
};

export function ActivityDialog({title, open, isLoading, onClose, items, icon}: ActivityDialogProps) {
    return <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
    >
        <DialogTitle id="scroll-dialog-title">
            <MaterialIcon type={icon} />
            {title}
        </DialogTitle>
        <DialogContent dividers={true}>
            {isLoading ? <CircularProgress/> :
                <List dense disablePadding>
                    {items && items.map((item) => (
                        <ListItem key={item.id}>
                            <ListItemIcon>
                                <RouteIcon fontSize="small"/>
                            </ListItemIcon>
                            <ListItemText primary={item.name}/>
                        </ListItem>
                    ))}
                </List>}
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Close</Button>
        </DialogActions>
    </Dialog>
}
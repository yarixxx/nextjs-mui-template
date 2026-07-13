import VerticalLinearStepper from "@/src/components/VerticalLinearStepper";
import {Stack } from "@mui/material";
import * as React from "react";
import {Download, Publish} from "@mui/icons-material";
import Paper from "@mui/material/Paper";

export default function Home() {

    return (
        <main>
            <Paper sx={{margin: 2, p: 2}} elevation={3}>
                <h1>Welcome!</h1>
                <div>
                    <Stack direction="row" spacing={3}>
                        <Download color='success'></Download>
                        <Publish color='warning'></Publish>
                    </Stack>
                </div>
                <VerticalLinearStepper></VerticalLinearStepper>
            </Paper>
        </main>
    );
}

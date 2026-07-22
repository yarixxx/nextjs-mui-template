import OnboardingStepper from "@/src/components/onboarding/OnboardingStepper";
import * as React from "react";
import Paper from "@mui/material/Paper";

export default function Home() {

    return (
        <main>
            <Paper sx={{margin: 2, p: 2}} elevation={3}>
                <OnboardingStepper></OnboardingStepper>
            </Paper>
        </main>
    );
}

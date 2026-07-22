import Image from "next/image";
import Paper from "@mui/material/Paper";

export function WelcomeStep() {
    return (
        <Paper
            elevation={3}
            sx={{
                width: 600,
                position: "relative",
                height: 400,
                overflow: "hidden",
            }}
        >
            <Image
                src="/welcome.png"
                alt="Welcome!"
                loading="eager"
                width={600}
                height={400}
                style={{
                    objectFit: "contain",
                }}
                />
        </Paper>
    );
}

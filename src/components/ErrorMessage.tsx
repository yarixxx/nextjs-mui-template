import Paper from "@mui/material/Paper";
import React from "react";

type ErrorMessageProps = {
    message: string;
    height?: number;
};

export default function ErrorMessage({ message, height = 700 }: ErrorMessageProps) {
    return (
        <Paper
            sx={{
                height,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <span style={{ color: 'red' }}>{message}</span>
        </Paper>
    );
}
import {useRef} from "react";
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';

interface FileSelectorProps {
    onFilesSelected: (files: File[]) => void;
    type: string;
}

export function FileSelector({
                                 onFilesSelected,
                                 type,
                             }: FileSelectorProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (event.target.files) {
            onFilesSelected(Array.from(event.target.files));

            // optional: reset input so selecting same file again triggers change
            event.target.value = '';
        }
    };

    return (
        <Box>
            <input
                ref={fileInputRef}
                type="file"
                accept={type}
                multiple
                onChange={handleFileChange}
                style={{display: "none"}}
            />

            <Button
                variant="contained"
                onClick={() => fileInputRef.current?.click()}
                sx={{mt: 1, mr: 1}}
            >
                Select File
            </Button>
        </Box>
    );
}
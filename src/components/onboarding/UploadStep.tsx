import {
    Box,
    Card,
    CardActions,
    CardContent,
    Button,
    Stack,
    Typography,
} from "@mui/material";
import {FileSelector} from "@/src/components/FileSelector";

interface UploadStepProps {
    filesSelectedHandler: (files: File[]) => void;
}

const samples = [
    {
        name: "Belmont Cycling",
        file: "/samples/Belmont Cycling.gpx",
    },
    {
        name: "Mountain View Walking",
        file: "/samples/Mountain View Walking.gpx",
    },
    {
        name: "San Bruno Cycling",
        file: "/samples/San Bruno Cycling.gpx",
    },
    {
        name: "San Carlos Cycling",
        file: "/samples/San Carlos Cycling.gpx",
    },
    {
        name: "San Francisco Inline Skating",
        file: "/samples/San Francisco Inline Skating.gpx",
    },
    {
        name: "San Francisco Running",
        file: "/samples/San Francisco Running.gpx",
    },
    {
        name: "San Mateo Hiking",
        file: "/samples/San Mateo Hiking.gpx",
    },
    {
        name: "Santa Clara County Hiking",
        file: "/samples/Santa Clara County Hiking.gpx",
    },
    {
        name: "Santa Clara Cycling",
        file: "/samples/Santa Clara Cycling.gpx",
    },
    {
        name: "South San Francisco Cycling",
        file: "/samples/South San Francisco Cycling.gpx",
    },
    {
        name: "Woodside Hiking",
        file: "/samples/Woodside Hiking.gpx",
    },
];

async function loadSample(filename: string): Promise<File> {
    const response = await fetch(filename);

    if (!response.ok) {
        throw new Error("Failed to load sample GPX");
    }

    const blob = await response.blob();

    return new File([blob], filename, {
        type: "application/gpx+xml",
    });
}

export function UploadStep({filesSelectedHandler}: UploadStepProps) {
    return (
        <Stack spacing={4}>
            <Box>
                <Typography variant="h6" gutterBottom>
                    Upload your own GPX
                </Typography>

                <Typography color="text.secondary" sx={{mb: 2}}>
                    Choose a GPX activity recorded by your GPS watch,
                    phone, Strava, Garmin, or another app.
                </Typography>

                <FileSelector
                    type="gpx"
                    onFilesSelected={filesSelectedHandler}
                />
            </Box>

            <Box>
                <Typography variant="h6" gutterBottom>
                    Or try a sample activity
                </Typography>

                <Typography color="text.secondary" sx={{mb: 2}}>
                    Explore the app instantly using one of the example GPX
                    tracks below.
                </Typography>

                <Stack
                    spacing={2}
                    direction="row"
                    useFlexGap
                    sx={{
                        flexWrap: "wrap",
                        overflowX: "auto",
                        pb: 1,
                    }}>
                    {samples.map(sample => (
                        <Card
                            key={sample.file}
                            variant="outlined"
                            sx={{
                                minWidth: 250,
                                flex: "1 1 250px",
                                maxWidth: 250,
                            }}>
                            <CardContent>
                                <Typography variant="subtitle1">
                                    {sample.name}
                                </Typography>
                            </CardContent>

                            <CardActions>
                                <Button
                                    variant="contained"
                                    onClick={async () => {
                                        const file = await loadSample(sample.file);
                                        filesSelectedHandler([file]);
                                    }}>
                                    Analyze
                                </Button>

                                <Button
                                    href={sample.file}
                                    download
                                >
                                    Download GPX
                                </Button>
                            </CardActions>
                        </Card>
                    ))}
                </Stack>
            </Box>
        </Stack>
    );
}
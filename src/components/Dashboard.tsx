"use client";

import {Card, CardContent, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import {VisitedCitiesDialog} from "@/src/components/dialogs/VisitedCitiesDialog";
import {VisitedParksDialog} from "@/src/components/dialogs/VisitedParksDialog";
import {TrailsDialog} from "@/src/components/dialogs/TrailsDialog";

const boxSx = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 2,
    maxWidth: {
        xs: 'calc(100vw - 24px)',
        md: '70vw',
    },
};

const cardSx = {
    flex: '1 1 220px',
    minHeight: 140,
}

interface DashboardProps {
    isLoading: boolean;
    totalScore: number;
    visitedCities: number;
    visitedParks: number;
    trails: number;
    segments: number;
    completedParks: number;
}

export default function Dashboard({
                                      isLoading,
                                      visitedCities,
                                      visitedParks,
                                      trails,
                                      segments,
                                      completedParks
                                  }: DashboardProps) {
    return (
        <main style={{padding: '24px'}}>
            <Typography color="text.secondary">
                Here is a snapshot of your exploration progress.
            </Typography>
            <Box sx={boxSx}>
                <Card
                    sx={cardSx}
                    variant="outlined">
                    <CardContent>
                        <Typography variant="h5">
                            {isLoading ? '...' : visitedCities ?? 0}
                        </Typography>
                        <Typography sx={{color: 'text.secondary'}}>
                            Visited Cities
                        </Typography>
                        <VisitedCitiesDialog filter="all"/>
                    </CardContent>
                </Card>
                <Card
                    sx={cardSx}
                    variant="outlined">
                    <CardContent>
                        <Typography variant="h5">
                            {isLoading ? '...' : visitedParks ?? 0}
                        </Typography>
                        <Typography sx={{color: 'text.secondary'}}>
                            Visited Parks
                        </Typography>
                        <VisitedParksDialog filter={'all'}/>
                    </CardContent>
                </Card>
                <Card
                    sx={cardSx}
                    variant="outlined">
                    <CardContent>
                        <Typography variant="h5">
                            {isLoading ? '...' : completedParks ?? 0}
                        </Typography>
                        <Typography sx={{color: 'text.secondary'}}>
                            Complete Parks
                        </Typography>
                        <VisitedParksDialog filter={'completed'}/>
                    </CardContent>
                </Card>
                <Card
                    sx={cardSx}
                    variant="outlined">
                    <CardContent>
                        <Typography variant="h5">
                            {isLoading ? '...' : segments ?? 0}
                        </Typography>
                        <Typography sx={{color: 'text.secondary'}}>
                            Segments visited
                        </Typography>
                    </CardContent>
                </Card>
                <Card
                    sx={cardSx}
                    variant="outlined">
                    <CardContent>
                        <Typography variant="h5">
                            {isLoading ? '...' : trails ?? 0}
                        </Typography>
                        <Typography sx={{color: 'text.secondary'}}>
                            Trails completed
                        </Typography>
                        <TrailsDialog filter={'completed'}/>
                    </CardContent>
                </Card>
            </Box>
        </main>
    );
}

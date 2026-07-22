"use client";

import {DataGrid, GridColDef, GridSortModel} from '@mui/x-data-grid';
import useSWR from 'swr';
import React, {useState} from "react";
import {Paper} from "@mui/material";
import ActivityTypeIcon from "@/src/components/ActivityTypeIcon";
import ErrorMessage from "@/src/components/ErrorMessage";
import {activitiesFetcherShort} from "@/src/services/activities";
import DeleteActivityButton from "@/src/components/DeleteActivityButton";
import {CitiesCell} from "@/src/components/cells/CitiesCell";
import {SegmentsCell} from "@/src/components/cells/SegmentsCell";
import {ShowMapCell} from "@/src/components/cells/ShowMapCell";
import {ParksCell} from "@/src/components/cells/ParksCell";
import {ShowActivitySummaryCell} from "@/src/components/cells/ShowActivitySummaryCell";

type TrailRow = {
    id: string;
    name: string;
    highway?: string | null;
    time: string;
    created_at: string;
    type?: string | null;
    segment_count?: number | null;
    total_segment_count?: number | null;
    distance: number;
    claimed_segments_count?: number | null;
    claimed_parks_count?: number | null;
    claimed_cities_count?: number | null;
};

export default function ActivitiesTable() {
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sortModel, setSortModel] = useState<GridSortModel>([
        {field: 'created_at', sort: 'desc'},
    ]);
    const sortField = sortModel[0]?.field ?? 'created_at';
    const sortDirection = sortModel[0]?.sort ?? 'desc';

    const {data, isLoading, error, mutate} = useSWR(
        ['activitiesFetcherShort', page, pageSize, sortField, sortDirection],
        () => activitiesFetcherShort(page, pageSize, sortField, sortDirection),
        {keepPreviousData: true},
    );

    const columns: GridColDef<TrailRow>[] = [
        {
            field: 'name',
            headerName: 'Name',
            width: 200,
            renderCell: ({row}) =>
                row.name
        },
        {
            field: 'type',
            headerName: 'Type',
            width: 80,
            renderCell: ({row}) =>
                <ActivityTypeIcon type={row.type}></ActivityTypeIcon>
        },
        {
            field: 'distance',
            headerName: 'Distance',
            width: 90,
            renderCell: ({row}) =>
                `${(row.distance / 1000).toFixed(2)} km`,
        },
        {
            field: 'claimed_cities_count',
            headerName: 'Cities',
            width: 90,
            renderCell: ({row}) => (
                <CitiesCell
                    activityId={row.id}
                    count={row.claimed_cities_count ?? 0}
                />
            )
        },
        {
            field: 'claimed_parks_count',
            headerName: 'Parks',
            width: 90,
            renderCell: ({row}) => (
                <ParksCell
                    activityId={row.id}
                    count={row.claimed_parks_count ?? 0}
                />
            )
        },
        {
            field: 'claimed_segments_count',
            headerName: 'Segments',
            width: 100,
            renderCell: ({row}) => (
                <SegmentsCell
                    activityId={row.id}
                    count={row.claimed_segments_count ?? 0}
                />
            )
        },
        {
            field: 'created_at',
            headerName: 'Uploaded',
            width: 120,
            renderCell:
                ({row}) =>
                    new Date(row.created_at).toLocaleDateString('en-US')
        },
        {
            field: 'summary',
            headerName: 'Show summary',
            sortable: false,
            width: 175,
            renderCell:
                ({row}) => {
                    return <ShowActivitySummaryCell activityId={row.id} />
                }
        },
        {
            field: 'map',
            headerName: 'Map',
            sortable: false,
            width: 150,
            renderCell:
                ({row}) => {
                    return <ShowMapCell activityId={row.id}/>
                }
        },
        {
            field: 'delete',
            headerName: 'Delete',
            width: 120,
            renderCell: ({row}) => {
                return <DeleteActivityButton
                    activityId={row.id}
                    activityName={row.name}
                    onDeleted={mutate}
                />
            }
        },
    ];

    if (error) {
        return <ErrorMessage message="Failed to load activities data."/>;
    }

    const rows = (data?.rows ?? []) as TrailRow[];
    const rowCount = data?.total || 0;

    return (
        <Paper sx={{height: 700, width: '100%'}}>
            <DataGrid<TrailRow>
                columns={columns}
                rows={rows}
                rowCount={rowCount}
                pageSizeOptions={[10]}
                paginationModel={{page, pageSize}}
                onPaginationModelChange={(model) => {
                    setPage(model.page);
                    setPageSize(model.pageSize);
                }}
                onSortModelChange={(model) => {
                    setSortModel(model);
                    setPage(0);
                }}
                paginationMode="server"
                loading={isLoading}
                pagination
                disableRowSelectionOnClick
            />
        </Paper>
    );
}
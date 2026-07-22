import {DataGrid, GridColDef, GridSortModel} from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import useSWR from 'swr';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import React from "react";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ErrorMessage from "@/src/components/ErrorMessage";
import {CompletionFilter, visitedStreetsWithSegmentsFetcher} from "@/src/services/activities";
import ActivityTypeIcon from "@/src/components/ActivityTypeIcon";

const columns: GridColDef[] = [
    {
        field: 'progress',
        sortable: false,
        headerName: 'Progress',
        width: 75,
        renderCell: ({row}) => {
            const visited = row.segment_count ?? 0;
            const total = row.total_segment_count ?? 0;
            if (visited === total) {
                return <CheckCircleIcon sx={{color: 'success.main'}}/>;
            }
            return <span>{visited}/{total}</span>;
        }
    },
    {field: 'name', headerName: 'Name', width: 150},
    {field: 'highway', headerName: 'Highway', width: 125},
    {
        field: 'completion_percent',
        headerName: 'Completion',
        width: 90,
        renderCell: ({row}) => `${row.completion_percent}%`
    },
    {
        field: 'activity_type',
        headerName: 'Activity Type',
        width: 75,
        renderCell: ({row}) => {
            return <ActivityTypeIcon type={row.activity_type}/>
        },
    },
];

type TrailsTableProps = {
    filter: CompletionFilter;
}

export default function TrailsTable({filter}: TrailsTableProps) {
    const [page, setPage] = React.useState(0);
    const [pageSize, setPageSize] = React.useState(10);

    const [completionFilter, setCompletionFilter] = React.useState<CompletionFilter>(filter);
    const initialSortField = "name";
    const initialSortDir = "asc";
    const [sortModel, setSortModel] = React.useState<GridSortModel>([
        {field: initialSortField, sort: initialSortDir as "asc" | "desc"},
    ]);
    const sortField = sortModel[0]?.field ?? 'name';
    const sortDirection = sortModel[0]?.sort ?? 'asc';
    const {data, isLoading, error} = useSWR(
        ['streetsWithSegmentsFetcher', page, pageSize, sortField, sortDirection, completionFilter],
        () => visitedStreetsWithSegmentsFetcher(page, pageSize, sortField, sortDirection, completionFilter),
        {keepPreviousData: true},
    );

    const rows = data?.rows || [];
    const rowCount = data?.total || 0;

    if (error) {
        return <ErrorMessage message="Failed to load trails data."/>;
    }

    return (
        <Paper sx={{height: 700, width: '100%'}}>
            <Box sx={{p: 2}}>
                <FormControl size="small" sx={{minWidth: 220}}>
                    <InputLabel id="trail-completion-filter-label">Completion</InputLabel>
                    <Select
                        labelId="trail-completion-filter-label"
                        label="Completion"
                        value={completionFilter}
                        onChange={({target}) => {
                            const value = target.value as CompletionFilter;
                            setCompletionFilter(value);
                            setPage(0);
                        }}
                    >
                        <MenuItem value="all">All trails</MenuItem>
                        <MenuItem value="completed">Completed trails</MenuItem>
                        <MenuItem value="not_completed">Not completed trails</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <DataGrid
                columns={columns}
                rows={rows}
                rowCount={rowCount}
                sortingMode="server"
                paginationModel={{page, pageSize}}
                pageSizeOptions={[10]}
                onPaginationModelChange={(model) => {
                    setPage(model.page);
                    setPageSize(model.pageSize);
                }}
                onSortModelChange={(model) => {
                    if (!model[0]) return;

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
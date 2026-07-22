import {DataGrid, GridColDef, GridSortModel} from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import useSWR from 'swr';
import React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import {CompletionFilter, visitedParksFetcher} from "@/src/services/activities";
import ErrorMessage from "@/src/components/ErrorMessage";

type VisitedParksTableProps = {
    filter: CompletionFilter;
}

export default function VisitedParksTable({filter}: VisitedParksTableProps) {
    const [page, setPage] = React.useState(0);
    const [pageSize, setPageSize] = React.useState(10);

    const [completionFilter, setCompletionFilter] = React.useState<CompletionFilter>(filter);
    const initialSortField = "name";
    const initialSortDir = "asc";
    const [sortModel, setSortModel] = React.useState<GridSortModel>([
        {field: initialSortField, sort: initialSortDir as "asc" | "desc"},
    ]);

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
        {field: 'total_segment_count', headerName: 'Segments', width: 75},
        {
            field: 'completion_percent',
            headerName: 'Completion',
            width: 75,
            renderCell: ({row}) => `${row.completion_percent}%`
        },
        {field: 'name', headerName: 'Name', width: 200},
    ];

    const sortField = sortModel[0]?.field ?? 'name';
    const sortDirection = sortModel[0]?.sort ?? 'asc';
    const {data, isLoading, error} = useSWR(
        ['visitedParksFetcher', page, pageSize, sortField, sortDirection, completionFilter],
        () => visitedParksFetcher(page, pageSize, sortField, sortDirection, completionFilter),
        {keepPreviousData: true},
    );

    if (error) {
        return <ErrorMessage message="Failed to load parks data."/>;
    }

    const rows = data?.rows || [];
    const rowCount = data?.total || 0;

    return (
        <Paper sx={{height: 700, width: '100%'}}>
            <Box sx={{p: 2}}>
                <FormControl size="small" sx={{minWidth: 220}}>
                    <InputLabel id="park-completion-filter-label">Completion</InputLabel>
                    <Select
                        labelId="park-completion-filter-label"
                        label="Completion"
                        value={completionFilter}
                        onChange={({target}) => {
                            const value = target.value as CompletionFilter;
                            setCompletionFilter(value);
                            setPage(0);
                        }}
                    >
                        <MenuItem value="all">All parks</MenuItem>
                        <MenuItem value="completed">Completed parks</MenuItem>
                        <MenuItem value="not_completed">In progress parks</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <DataGrid
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
                    if (!model[0]) return;
                    setSortModel(model);
                    setPage(0);
                }}
                sortingMode="server"
                paginationMode="server"
                loading={isLoading}
                pagination
                disableRowSelectionOnClick
            />
        </Paper>
    );
}
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
import {CompletionFilter, visitedCitiesFetcher} from "../../services/activities";
import ErrorMessage from "@/src/components/ErrorMessage";

type VisitedCitiesTableProps = {
    filter: CompletionFilter;
};

export default function VisitedCitiesTable({filter}: VisitedCitiesTableProps) {
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
            width: 80,
            renderCell: ({row}) => {
                const visited = row.segment_count ?? 0;
                const total = row.total_segment_count ?? 0;
                if (visited === total) {
                    return <CheckCircleIcon sx={{color: 'success.main'}}/>;
                }
                return <span>{visited}/{total}</span>;
            }
        },
        {field: 'total_segment_count', headerName: 'Segments', width: 90},
        {field: 'name', headerName: 'Name', width: 150},
        {
            field: 'completion_percent',
            headerName: 'Completion',
            width: 90,
            renderCell: ({row}) => `${row.completion_percent}%`
        },
    ];

    const sortField = sortModel[0]?.field ?? 'name';
    const sortDirection = sortModel[0]?.sort ?? 'asc';
    const {data, isLoading, error} = useSWR(
        ['visitedCitiesFetcher', page, pageSize, sortField, sortDirection, completionFilter],
        () => visitedCitiesFetcher(page, pageSize, sortField, sortDirection, completionFilter),
        {keepPreviousData: true},
    );

    if (error) {
        return <ErrorMessage message="Failed to load cities data."/>;
    }

    const rows = data?.rows || [];
    const rowCount = data?.total || 0;

    return (
        <Paper sx={{height: 700, width: '100%'}}>
            <Box sx={{p: 2}}>
                <FormControl size="small" sx={{minWidth: 220}}>
                    <InputLabel id="city-completion-filter-label">Completion</InputLabel>
                    <Select
                        labelId="city-completion-filter-label"
                        label="Completion"
                        value={completionFilter}
                        onChange={({target}) => {
                            const value = target.value as CompletionFilter;
                            setCompletionFilter(value);
                            setPage(0);
                        }}
                    >
                        <MenuItem value="all">All cities</MenuItem>
                        <MenuItem value="completed">Completed cities</MenuItem>
                        <MenuItem value="not_completed">In progress cities</MenuItem>
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
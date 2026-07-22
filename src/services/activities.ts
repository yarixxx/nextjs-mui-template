import {createClient} from "@/src/lib/supabase/client";
import {SortDirection} from "@mui/material";
import {Feature, GeoJsonProperties, Geometry} from "geojson";
import {buildAiSummaryInput} from "@/src/util/converters";
import {generateActivitySummary} from "@/src/services/ai";

export type PageResult = { rows: unknown[]; total: number };
export type CompletionFilter = 'all' | 'completed' | 'not_completed';
export type StatsResults = {
    activities: number;
    visitedParks: number;
    completedParks: number;
    inProgressParks: number;
    trails: number;
    visitedCities: number;
    segments: number;
};

export async function getActivityDetails(activity_id: string) {
    const supabase = createClient();
    const {data} = await supabase.rpc("get_activity_details", {
        my_activity_id: activity_id,
    });
    return data;
}

export async function getActivityDetailsForAi(activity_id: string) {
    const supabase = createClient();
    const {data} = await supabase.rpc("get_extra_activity_details", {
        my_activity_id: activity_id,
    });
    console.log('data', data);
    const stats = buildAiSummaryInput(data);
    console.log('stats', stats)
    return await generateActivitySummary(stats)
}

export async function getActivity(activity_id: string) {
    const supabase = createClient();
    const {data} = await supabase.rpc("get_activity", {
        my_activity_id: activity_id,
    });
    return data;
}

export async function getActivityCities(activity_id: string) {
    const supabase = createClient();
    const {data} = await supabase.rpc("get_activity_cities", {
        my_activity_id: activity_id,
    });
    return await data;
}

export async function getActivityParks(activity_id: string) {
    const supabase = createClient();
    const {data} = await supabase.rpc("get_activity_parks", {
        my_activity_id: activity_id,
    });
    return data;
}

export async function fetchById(table: string, id: string): Promise<any> {
    const supabase = createClient();
    const {data: {user}} = await supabase.auth.getUser();
    const {data, error} = await supabase
        .from(table)
        .select('*')
        .eq('user_id', user!.id)
        .eq('id', id)
        .single();

    if (error) {
        console.error('fetchById', table, id, error);
    }
    return data;
}

export async function getAllVisitedParks(): Promise<Feature[]> {
    const supabase = createClient();
    const {data: {user}} = await supabase.auth.getUser();

    const {data, error} = await supabase
        .from('my_visited_parks_full')
        .select('*')
        .eq('user_id', user!.id);

    if (error) {
        console.error(error);
    }

    return (data ? data : []).map((row) => {
        const {geometry, ...properties} = row;

        return {
            type: 'Feature' as const,
            id: properties.id,
            geometry,
            properties
        };
    });
}

export async function getAllVisitedCitiesShapes(): Promise<Feature[]> {
    const supabase = createClient();
    const {data: {user}} = await supabase.auth.getUser();

    const {data, error} = await supabase
        .from('my_visited_cities_shapes')
        .select('*')
        .eq('user_id', user!.id);

    if (error) {
        console.error(error);
    }

    return (data ? data : []).map((row) => {
        const {geometry, name, id, osm, user_id} = row;

        return {
            type: 'Feature' as const,
            id,
            geometry,
            properties: {name, user_id, osm}
        };
    });
}

export async function allActivitiesFetcher(): Promise<Feature[]> {
    const supabase = createClient();
    const {data: {user}} = await supabase.auth.getUser();

    const {data, error} = await supabase
        .from('my_activities')
        .select('id,simplified_geometry')
        .eq('user_id', user!.id);

    if (error) {
        throw error;
    }

    return (data ? data : []).map((row) => {
        const {simplified_geometry, ...properties} = row;

        return {
            type: 'Feature' as const,
            id: properties.id,
            geometry: simplified_geometry,
            properties
        };
    });
}

export async function uploadActivityAction(activities: Feature<Geometry, GeoJsonProperties>[]): Promise<string[]> {
    const p_activities = activities.map((act) => {
        return {...act, type: act.properties!['type'], time: act.properties!['time'], name: act.properties!['name']}
    });
    const supabase = await createClient();
    const {data, error} = await supabase.rpc('insert_activities_bulk', {p_activities});
    if (error) {
        console.error(error);
        throw error;
    } else {
        if (data) {
            console.info(`Saved ${data.length} activities.`);
        } else {
            console.info('Not saved activities.');
        }
    }
    return data.map((activity: { id: string; }) => activity.id);
}

export async function saveVisitedSegments(newSegments: { user_id: string, activity_id: string, osm: string }[]) {
    const supabase = createClient();
    const {data: insertedRows, error: insertError} = await supabase.from('my_visited_segments')
        .upsert(newSegments, {onConflict: 'user_id,osm', ignoreDuplicates: true}).select();
    if (insertError) {
        console.error('Supabase insert error:', insertError);
    }

    return insertedRows?.length;
}

export async function claimCities(my_activity_id: string) {
    const supabase = await createClient();
    const {data, error} = await supabase.rpc('claim_cities', {my_activity_id});
    if (error) {
        console.error(error);
        throw error;
    } else {
        if (data > 0) {
            console.info(`Claimed ${data} cities`);
        } else {
            console.info(`No new cities`);
        }
    }
    return data;
}

export async function claimSegments(activity_id: string) {
    const segments = await findVisitedSegments(activity_id);
    console.info(`Found ${segments.length} segments.`);
    return await saveVisitedSegments(segments)
}

export async function claimParks(my_activity_id: string) {
    const supabase = await createClient();
    const {data, error} = await supabase.rpc('claim_parks', {my_activity_id});
    if (error) {
        console.error(error);
        throw error;
    } else {
        if (data > 0) {
            console.info(`Claimed ${data} new parks`);
        } else {
            console.info(`No new parks`);
        }
    }
    return data;
}

export async function deleteActivity(id: string) {
    const supabase = await createClient();
    const {data: {user}} = await supabase.auth.getUser();

    if (!user) {
        throw new Error('Not authenticated');
    }

    const {data, error} = await supabase
        .from('my_activities')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)
        .select();

    console.info(`Deleted activity ${id}`, error, data);

    if (error) {
        console.error(error);
        throw error;
    }
}

export async function statsResultsFetcher(): Promise<StatsResults> {
    const supabase = createClient();
    const {data: {user}} = await supabase.auth.getUser();

    if (!user) {
        throw Error('Execute order 66.');
    }

    const {data: dashboardCounts, error: countError} = await supabase.rpc('get_dashboard_counts', {uid: user.id});
    if (countError) {
        console.error('countError', countError?.message)
    }

    const [
        trailsResult,
        parksResult,
    ] = await Promise.all([
        supabase
            .from('user_completed_street_counts')
            .select('')
            .eq('user_id', user.id)
            .single(),

        supabase
            .from('visited_park_segments_summary')
            .select('')
            .eq('user_id', user.id)
            .single(),
    ]);

    const completed_street_count = trailsResult.success && trailsResult.data ? trailsResult.data.completed_street_count : 0;
    const completed_parks = parksResult.success && parksResult.data ? parksResult.data.completed_parks : 0;
    const in_progress_parks = parksResult.success && parksResult.data ? parksResult.data.in_progress_parks : 0;

    return {
        activities: dashboardCounts[0].activities,
        visitedCities: dashboardCounts[0].visited_cities,
        visitedParks: dashboardCounts[0].visited_parks,
        segments: dashboardCounts[0].visited_segments,
        completedParks: completed_parks,
        inProgressParks: in_progress_parks,
        trails: completed_street_count,
    };
}

export async function visitedCitiesFetcher(
    page: number, pageSize: number,
    sortField = 'name', sortDirection: SortDirection = 'asc', completionFilter: CompletionFilter = 'all'
) {
    return pagedTableFetcher("my_visited_cities_short", page, pageSize, sortField, sortDirection, completionFilter);
}

export async function visitedParksFetcher(
    page: number, pageSize: number,
    sortField = 'name', sortDirection: SortDirection = 'asc', completionFilter: CompletionFilter = 'all'
) {
    return pagedTableFetcher("my_visited_parks_full", page, pageSize, sortField, sortDirection, completionFilter);
}

export async function visitedStreetsWithSegmentsFetcher(
    page: number, pageSize: number,
    sortField = 'name', sortDirection: SortDirection = 'asc', completionFilter: CompletionFilter = 'all'
) {
    const actualSortField = sortField === 'progress' ? 'segment_count' : sortField;
    return pagedTableFetcher("my_visited_streets_short", page, pageSize, actualSortField, sortDirection, completionFilter);
}

export async function findVisitedSegments(activityId: string) {
    const supabase = createClient();
    const {data, error} = await supabase.rpc(
        'find_visited_segments',
        {activity_id: activityId, percent_complete: 0.99}
    );
    if (error) {
        console.error(error);
    }
    return (data ? data : []).map(
        ({user_id, activity_id, osm}: { user_id: string, activity_id: string, osm: string }) => {
            return {user_id, activity_id, osm};
        });
}

async function pagedTableFetcher(
    table: string,
    page: number,
    pageSize: number,
    sortField = 'name',
    sortDirection: SortDirection = 'asc',
    completionFilter?: CompletionFilter
): Promise<PageResult> {
    const supabase = createClient();
    const {data: {user}} = await supabase.auth.getUser();
    const from = page * pageSize;
    const to = from + pageSize - 1;
    let query = supabase.from(table).select('*', {count: 'exact'});

    // Optional completion filter
    if (completionFilter === 'completed') query = query.eq('is_completed', true);
    if (completionFilter === 'not_completed') query = query.eq('is_completed', false);

    const {data, count, error} = await query
        .order(sortField, {ascending: sortDirection === 'asc'})
        .eq('user_id', user!.id)
        .range(from, to);

    if (error) {
        console.error('pagedTableFetcher', table, error.message);
    }
    return {rows: data ?? [], total: count ?? 0};
}

export async function activitiesFetcher(
    page: number,
    pageSize: number,
    sortField = 'name',
    sortDirection: SortDirection = 'asc'): Promise<PageResult> {
    return pagedTableFetcher("my_activities_full", page, pageSize, sortField, sortDirection);
}

export async function activitiesFetcherShort(
    page: number,
    pageSize: number,
    sortField = 'name',
    sortDirection: SortDirection = 'asc'): Promise<PageResult> {
    return pagedTableFetcher("my_activities_short", page, pageSize, sortField, sortDirection);
}



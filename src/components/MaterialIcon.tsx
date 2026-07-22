import {DirectionsWalk, LocationCity, Park, Route} from "@mui/icons-material";

type MaterialIconProps = {
    type: 'city' | 'park' | 'segment' | 'street' | 'activity' | 'cycling'
};

export default function MaterialIcon({ type }: MaterialIconProps) {
    if (type === 'city') {
        return <LocationCity titleAccess="City" />;
    }

    if (type === 'park') {
        return <Park titleAccess="Park" />;
    }

    if (type === 'activity') {
        return <DirectionsWalk titleAccess="Activity" />;
    }

    if (type === 'segment') {
        return <Route titleAccess="Route" />;
    }

    return <>{type ?? 'N/A'}</>;
}
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import RollerSkatingIcon from '@mui/icons-material/RollerSkating';

type ActivityTypeIconProps = {
    type?: string | null;
};

export default function ActivityTypeIcon({ type }: ActivityTypeIconProps) {
    if (type === 'walking') {
        return <DirectionsWalkIcon titleAccess="Walking" />;
    }

    if (type === 'hiking') {
        return <DirectionsWalkIcon titleAccess="Hiking" />;
    }

    if (type === 'cycling') {
        return <DirectionsBikeIcon titleAccess="Cycling" />;
    }

    if (type === 'inline_skating') {
        return <RollerSkatingIcon titleAccess="RollerSkatingIcon" />;
    }



    return <>{type ?? 'N/A'}</>;
}
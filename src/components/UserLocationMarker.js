import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Marker, useMap } from 'react-leaflet';
import userMarker from '../images/pink_marker_down.png';

const UserLocationMarker = (props) => {
	const { userPosition } = props;
	const map = useMap();
	const hasCenteredRef = useRef(false);

	const userLocationIcon = new L.Icon({
		iconUrl: userMarker,
		iconSize: [30, 30],
		iconAnchor: [15, 30],
	});

	useEffect(() => {
		if (userPosition && !hasCenteredRef.current) {
			map.flyTo(userPosition, 13);
			hasCenteredRef.current = true;
		}
	}, [map, userPosition]);

	return userPosition === null ? null : <Marker position={userPosition} icon={userLocationIcon} />;
};

export default UserLocationMarker;

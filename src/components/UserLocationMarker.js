import { useEffect, useState } from 'react';
import L from 'leaflet';
import { Marker } from 'react-leaflet';
import { useMap } from 'react-leaflet';
import userMarker from '../images/pink_marker_down.png';

const UserLocationMarker = () => {
	const [userPosition, setUserPosition] = useState(null);

	const userLocationIcon = new L.Icon({
		iconUrl: userMarker,
		iconSize: [30, 30],
	});

	useEffect(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					console.log('position: ', position.coords);
					const { latitude, longitude } = position.coords;
					setUserPosition([latitude, longitude]);
				},
				() => {
					console.error("Failed to obtain the user's location");
				}
			);
		}
	}, []);

	/*
	const map = useMap();
	
	useEffect(() => {
		if (userPosition) {
			map.flyTo(userPosition, 13);
		}
	}, [map, userPosition]);*/

	return userPosition === null ? null : <Marker position={userPosition} icon={userLocationIcon} />;
};

export default UserLocationMarker;

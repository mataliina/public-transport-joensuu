import { useEffect, useState } from 'react';
import L from 'leaflet';
import { Marker } from 'react-leaflet';
import userMarker from '../images/pink_marker_down.png';

const UserLocationMarker = () => {
	const [userPosition, setUserPosition] = useState(null);

	const userLocationIcon = new L.Icon({
		iconUrl: userMarker,
		iconSize: [30, 30],
	});

	useEffect(() => {
		if (navigator.geolocation) {
			const watchId = navigator.geolocation.watchPosition(
				(position) => {
					const { latitude, longitude } = position.coords;
					setUserPosition([latitude, longitude]);
				},
				(error) => {
					console.error('Error watching position:', error);
				},
				{ enableHighAccuracy: true }
			);
			return () => navigator.geolocation.clearWatch(watchId);
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

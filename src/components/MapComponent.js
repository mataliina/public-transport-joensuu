import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import RotateMarker from './RotateMarker';
import VehicleMarker from './VehicleMarker';
import UserLocationMarker from './UserLocationMarker';

const FitBounds = ({ positions }) => {
	const map = useMap();
	const previousBounds = useRef(positions);
	useEffect(() => {
		// Only used if the user has set a new line to be tracked
		if (positions.length > 0 && positions !== previousBounds.current) {
			const bounds = L.latLngBounds(positions);
			//map.fitBounds(bounds, { padding: [25, 25] });
			const padding = [22, 22];
			const maxZoom = positions.length > 1 ? null : 16;
			map.flyToBounds(bounds, { padding, maxZoom });
		}
	}, [positions, map]);
	return null;
};

// const openStreetMapUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
//attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"

const MapComponent = (props) => {
	const { vehiclesOnRoute, busPositions, setSelectedVehicle } = props;
	const [userPosition, setUserPosition] = useState(null);
	const apikey = process.env.REACT_APP_THUNDERFOREST_API_KEY;

	// watch user location:
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

	const center = userPosition || [62.600785, 29.763171]; // Joensuu city center

	return (
		<MapContainer center={center} zoom={13} style={{ height: '70vh', width: '100%' }}>
			<TileLayer
				url={`/.netlify/functions/thunderforestProxy?z={z}&x={x}&y={y}`}
				attribution='&copy; <a href="https://www.thunderforest.com/">Thunderforest</a>, <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			/>
			{vehiclesOnRoute.length > 0 &&
				vehiclesOnRoute.map((vehicle, index) => {
					return <RotateMarker vehicle={vehicle} key={index} />;
				})}
			{vehiclesOnRoute.length > 0 &&
				vehiclesOnRoute.map((vehicle, index) => {
					return <VehicleMarker vehicle={vehicle} key={index} setSelectedVehicle={setSelectedVehicle} />;
				})}
			<FitBounds positions={busPositions} />
			{userPosition && <UserLocationMarker userPosition={userPosition} />}
		</MapContainer>
	);
};

export default MapComponent;

import React, { useState, useEffect, useContext } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import VehicleMarker from './VehicleMarker';
import { StopsContext } from '../context/StopsContext';
import useGTFSRealtimeData from '../hooks/useGTFSRealtimeData';
import StopInfo from './StopInfo';
import RouteStops from './RouteStops';
import RouteSelector from './RouteSelector';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import Alert from '@mui/material/Alert';

const VehicleMap = () => {
	const [vehiclesOnRoute, setVehiclesOnRoute] = useState([]);
	const [selectedVehicle, setSelectedVehicle] = useState(null);
	const [selectedRoute, setSelectedRoute] = useState('');
	const [center, setCenter] = useState([62.60841, 29.871332]); // Leveälahti I: 62.60841, 29.871332
	const { fetchStops } = useContext(StopsContext);

	const { data, loading, error } = useGTFSRealtimeData('/joensuu/api/gtfsrealtime/v1.0/feed/vehicleposition');

	useEffect(() => {
		if (data && selectedRoute) {
			let vehiclesOnSelectedRoute = data.entity.filter((entity) => {
				return entity.vehicle.trip.routeId === selectedRoute;
			});

			if (vehiclesOnSelectedRoute.length > 0) setVehiclesOnRoute(vehiclesOnSelectedRoute);

			if (vehiclesOnSelectedRoute.length === 1) setSelectedVehicle(vehiclesOnSelectedRoute[0]);
		}
	}, [data, selectedRoute]);

	useEffect(() => {
		if (selectedVehicle) {
			let newCenter = [selectedVehicle.vehicle.position.latitude, selectedVehicle.vehicle.position.longitude];
			console.log('newCenter: ', newCenter);
			setCenter(newCenter);
		}
	}, [selectedVehicle]);

	useEffect(() => {
		fetchStops();
	}, []);

	return (
		<div>
			<MapContainer center={center} zoom={13} style={{ height: '70vh', width: '100%' }}>
				<TileLayer
					url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
					attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
				/>
				{vehiclesOnRoute.length > 0 &&
					vehiclesOnRoute.map((vehicle, index) => {
						return <VehicleMarker vehicle={vehicle} key={index} setSelectedVehicle={setSelectedVehicle} />;
					})}
			</MapContainer>
			<Grid2 container spacing={2}>
				<Grid2 xs={6}>
					<RouteSelector
						selectedRoute={selectedRoute}
						setSelectedRoute={setSelectedRoute}
						setSelectedVehicle={setSelectedVehicle}
						setVehiclesOnRoute={setVehiclesOnRoute}
					/>
					{vehiclesOnRoute.length === 0 && selectedRoute !== '' && (
						<Alert severity='warning'>Linjalla ei ole liikennettä juuri nyt</Alert>
					)}
					{vehiclesOnRoute.length > 1 && selectedVehicle === null && <Alert severity='info'>Valitse bussi kartalta</Alert>}
					{selectedVehicle && <RouteStops vehicle={selectedVehicle} />}
				</Grid2>
				<Grid2>
					<StopInfo />
				</Grid2>
			</Grid2>
		</div>
	);
};

export default VehicleMap;

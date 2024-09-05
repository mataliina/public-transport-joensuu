import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import VehicleMarker from './VehicleMarker';
import useGTFSRealtimeData from '../hooks/useGTFSRealtimeData';
import StopInfo from './StopInfo';
import RouteStops from './RouteStops';
import RouteSelector from './RouteSelector';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import Alert from '@mui/material/Alert';
import StopSearch from './StopSearch';
import RotateMarker from './RotateMarker';

const FitBounds = ({ positions }) => {
	const map = useMap();
	const previousBounds = useRef(positions);
	useEffect(() => {
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

const VehicleMap = () => {
	const [vehiclesOnRoute, setVehiclesOnRoute] = useState([]);
	const [selectedVehicle, setSelectedVehicle] = useState(null);
	const [selectedRoute, setSelectedRoute] = useState('');
	const [busPositionsChanged, setBusPositionsChanged] = useState(false);
	const [busPositions, setBusPositions] = useState([
		[62.605051, 29.743884],
		[62.599988, 29.774635],
	]); // Joensuu city center [62.600785, 29.763171]

	const { data } = useGTFSRealtimeData('/joensuu/api/gtfsrealtime/v1.0/feed/vehicleposition', 2000);

	useEffect(() => {
		if (data && selectedRoute) {
			let vehiclesOnSelectedRoute = data.entity.filter((entity) => {
				return entity.vehicle.trip.routeId === selectedRoute;
			});

			if (vehiclesOnSelectedRoute.length > 0) setVehiclesOnRoute(vehiclesOnSelectedRoute);
			if (vehiclesOnSelectedRoute.length === 1) setSelectedVehicle(vehiclesOnSelectedRoute[0]);
			if (vehiclesOnRoute.length > 0 && busPositionsChanged) {
				let newPositions = [];
				vehiclesOnRoute.forEach((vehicle) => {
					newPositions.push([vehicle.vehicle.position.latitude, vehicle.vehicle.position.longitude]);
				});
				setBusPositions(newPositions);
				setBusPositionsChanged(false);
			}
		}
	}, [data, selectedRoute, selectedVehicle]);

	return (
		<Grid2 container rowSpacing={2} columnSpacing={1}>
			<MapContainer center={[62.600785, 29.763171]} zoom={13} style={{ height: '70vh', width: '100%' }}>
				<TileLayer
					url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
					attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
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
			</MapContainer>
			<Grid2 container spacing={2} xs={12}>
				<Grid2 xs={12} md={6}>
					<RouteSelector
						selectedRoute={selectedRoute}
						setBusPositionsChanged={setBusPositionsChanged}
						setSelectedRoute={setSelectedRoute}
						setSelectedVehicle={setSelectedVehicle}
						setVehiclesOnRoute={setVehiclesOnRoute}
					/>
					{vehiclesOnRoute.length === 0 && selectedRoute !== '' && (
						<Alert severity='warning'>Linjalla ei ole liikennettä juuri nyt</Alert>
					)}
					{vehiclesOnRoute.length > 1 && selectedVehicle === null && (
						<Alert severity='info'>Valitse bussi kartalta nähdäksesi seuraavat pysäkit</Alert>
					)}
					{selectedVehicle && <RouteStops vehicle={selectedVehicle} />}
				</Grid2>
				<Grid2 xs={12} md={6} justifyContent='center' alignItems='center'>
					<StopSearch />
					<StopInfo />
				</Grid2>
			</Grid2>
		</Grid2>
	);
};

export default VehicleMap;

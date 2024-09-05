import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import useGTFSRealtimeData from '../hooks/useGTFSRealtimeData';
import StopInfo from './StopInfo';
import RouteStops from './RouteStops';
import RouteSelector from './RouteSelector';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import Alert from '@mui/material/Alert';
import StopSearch from './StopSearch';
import MapComponent from './MapComponent';

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
			<MapComponent vehiclesOnRoute={vehiclesOnRoute} busPositions={busPositions} setSelectedVehicle={setSelectedVehicle} />
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

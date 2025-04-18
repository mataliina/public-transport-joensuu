import React, { useContext, useState, useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import useGTFSRealtimeData from '../hooks/useGTFSRealtimeData';
import StopInfo from './StopInfo';
import RouteStops from './RouteStops';
import RouteSelector from './RouteSelector';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import StopSearch from './StopSearch';
import MapComponent from './MapComponent';
import { getCookie } from '../utils/cookies';
import { Typography } from '@mui/material';
import { VEHICLE_POSITION_DATA_URL } from '../utils/dataUrls';
import { vehicleLocales } from '../utils/locales';
import { RoutesContext } from '../context/RoutesContext';
import { StopsContext } from '../context/StopsContext';

const VehicleMap = () => {
	const [vehiclesOnRoute, setVehiclesOnRoute] = useState([]);
	const [selectedVehicle, setSelectedVehicle] = useState(null);
	const [selectedRoute, setSelectedRoute] = useState('');
	const [busPositions, setBusPositions] = useState([
		[62.605051, 29.743884],
		[62.599988, 29.774635],
	]); // Joensuu city center [62.600785, 29.763171]

	const newRouteSelected = useRef(false); // for setting bounds for map only after user selected new route

	const { data, loading } = useGTFSRealtimeData(VEHICLE_POSITION_DATA_URL, 2000);

	const { loading: routesLoading } = useContext(RoutesContext);
	const { loading: stopsLoading } = useContext(StopsContext);

	useEffect(() => {
		const selectedRoutesCookie = getCookie('selectedRoutes');
		if (selectedRoutesCookie) {
			setSelectedRoute(selectedRoutesCookie);
		}
	}, []);

	useEffect(() => {
		if (data && selectedRoute) {
			let vehiclesOnSelectedRoute;
			if (selectedRoute === 'all' || selectedRoute.includes('all')) {
				vehiclesOnSelectedRoute = data.entity;
			} else {
				vehiclesOnSelectedRoute = data.entity.filter((entity) => {
					return selectedRoute.includes(entity.vehicle.trip.routeId);
				});
			}

			if (vehiclesOnSelectedRoute.length > 0) setVehiclesOnRoute(vehiclesOnSelectedRoute);
			if (vehiclesOnSelectedRoute.length === 1) setSelectedVehicle(vehiclesOnSelectedRoute[0]);
			// setting new bounds for map after user selected a new route, based on bus locations:
			if (vehiclesOnSelectedRoute.length > 0 && newRouteSelected.current) {
				let newPositions = [];
				vehiclesOnSelectedRoute.forEach((vehicle) => {
					newPositions.push([vehicle.vehicle.position.latitude, vehicle.vehicle.position.longitude]);
				});
				newRouteSelected.current = false;
				setBusPositions(newPositions);
			}
		}
	}, [data, selectedRoute, selectedVehicle]);

	if (loading || routesLoading || stopsLoading) {
		return (
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					height: '100vh', // Koko näkymä
				}}
			>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<Grid2 container rowSpacing={2} columnSpacing={1}>
			<MapComponent vehiclesOnRoute={vehiclesOnRoute} busPositions={busPositions} setSelectedVehicle={setSelectedVehicle} />
			<Grid2 container spacing={2} xs={12}>
				<Grid2 xs={12} md={6}>
					<RouteSelector
						selectedRoute={selectedRoute}
						setSelectedRoute={setSelectedRoute}
						setSelectedVehicle={setSelectedVehicle}
						setVehiclesOnRoute={setVehiclesOnRoute}
						newRouteSelected={newRouteSelected}
					/>
					{loading && <Typography variant='body1'>{vehicleLocales.loading}</Typography>}
					{!loading && vehiclesOnRoute.length === 0 && selectedRoute.length > 0 && (
						<Alert severity='warning'>{vehicleLocales.no_vehicles}</Alert>
					)}
					{!loading && vehiclesOnRoute.length > 1 && selectedVehicle === null && (
						<Alert severity='info'>{vehicleLocales.select_vehicle}</Alert>
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

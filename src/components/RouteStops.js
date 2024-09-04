import { useState, useEffect } from 'react';
import useGTFSRealtimeData from '../hooks/useGTFSRealtimeData';
import { List, Typography } from '@mui/material';
import StopItem from './StopItem';

const RouteStops = (props) => {
	const { vehicle } = props;
	const { data, loading } = useGTFSRealtimeData('/joensuu/api/gtfsrealtime/v1.0/feed/tripupdate');

	const [stopsOnRoute, setStopsOnRoute] = useState([]);

	useEffect(() => {
		if (!loading && vehicle) getStopsOnRoute(vehicle);
	}, [vehicle, loading]);

	const getStopsOnRoute = (vehicle) => {
		if (data && vehicle) {
			let tripOnRoute = data.entity.find((entity) => {
				return entity.tripUpdate.trip.tripId === vehicle.vehicle.trip.tripId;
			});
			setStopsOnRoute(tripOnRoute.tripUpdate.stopTimeUpdate);
		}
	};

	if (loading) return <p>Loading stops...</p>;

	return (
		<div>
			{vehicle && (
				<Typography variant='h2' color='primary'>
					{vehicle.vehicle.trip.routeId} {vehicle.vehicle.vehicle.label}
				</Typography>
			)}
			{stopsOnRoute.length > 0 && (
				<List>
					{stopsOnRoute.map((stop, index) => {
						return <StopItem key={index} stop={stop} />;
					})}
				</List>
			)}
		</div>
	);
};

export default RouteStops;

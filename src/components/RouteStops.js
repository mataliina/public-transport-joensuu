import { useContext, useState, useEffect } from 'react';
import { StopsContext } from '../context/StopsContext';
import useGTFSRealtimeData from '../hooks/useGTFSRealtimeData';
import { List, ListItem } from '@mui/material';

const RouteStops = (props) => {
	const { vehicle } = props;
	const { getStopName } = useContext(StopsContext);
	const { data, loading, error } = useGTFSRealtimeData('/joensuu/api/gtfsrealtime/v1.0/feed/tripupdate');

	const [stopsOnRoute, setStopsOnRoute] = useState([]);

	useEffect(() => {
		if (!loading && vehicle) getStopsOnRoute(vehicle);
		console.log('stopinfo vehicle: ', vehicle);
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
				<h2>
					{vehicle.vehicle.trip.routeId} {vehicle.vehicle.vehicle.label}
				</h2>
			)}
			{stopsOnRoute.length > 0 && (
				<List>
					{stopsOnRoute.map((stop, index) => {
						return (
							<ListItem key={index}>
								{stop.stopSequence} <b>{getStopName(stop.stopId)}</b>{' '}
								<span>Saapuu: {stop.arrival ? new Date(stop.arrival.time * 1000).toLocaleTimeString() : 'N/A'} </span>
								<span>Lähtee: {stop.departure ? new Date(stop.departure.time * 1000).toLocaleTimeString() : 'N/A'} </span>
							</ListItem>
						);
					})}
				</List>
			)}
		</div>
	);
};

export default RouteStops;

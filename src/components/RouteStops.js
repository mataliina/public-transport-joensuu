import { useState, useEffect } from 'react';
import useGTFSRealtimeData from '../hooks/useGTFSRealtimeData';
import { List, Typography } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StopItem from './StopItem';

const RouteStops = (props) => {
	const { vehicle } = props;
	const { data, loading } = useGTFSRealtimeData('/joensuu/api/gtfsrealtime/v1.0/feed/tripupdate');

	const [stopsOnRoute, setStopsOnRoute] = useState([]);

	useEffect(() => {
		if (!loading && vehicle) getStopsOnRoute(vehicle);
	}, [vehicle, loading, data]);

	const getStopsOnRoute = (vehicle) => {
		if (data && vehicle) {
			let tripOnRoute = data.entity.find((entity) => {
				if (entity.tripUpdate) {
					return entity.tripUpdate.trip.tripId === vehicle.vehicle.trip.tripId;
				}
				return null;
			});
			if (tripOnRoute) {
				setStopsOnRoute(tripOnRoute.tripUpdate.stopTimeUpdate);
			} else {
				setStopsOnRoute([]);
			}
		}
	};

	if (loading) return <Typography variant='body1'>Haetaan pysäkkejä...</Typography>;

	return (
		<div>
			{/*vehicle && (
				<div>
					<Typography variant='h2' color='primary'>
						{vehicle.vehicle.trip.routeId} {vehicle.vehicle.vehicle.label}
					</Typography>
					<Typography variant='h5'>Seuraavat pysäkit</Typography>
				</div>
			)*/}
			{stopsOnRoute.length > 0 && (
				<Accordion defaultExpanded>
					<AccordionSummary aria-controls='next-stops-panel-content' id='next-stops-panel-header' expandIcon={<ExpandMoreIcon />}>
						<Typography variant='body1' sx={{ color: 'primary.main', marginRight: '5px', fontWeight: 'bold' }}>
							{vehicle.vehicle.vehicle.label}
						</Typography>
						<Typography variant='body1'>seuraavat pysäkit</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<List>
							{stopsOnRoute.map((stop, index) => {
								return <StopItem key={index} stop={stop} />;
							})}
						</List>
					</AccordionDetails>
				</Accordion>
			)}
		</div>
	);
};

export default RouteStops;

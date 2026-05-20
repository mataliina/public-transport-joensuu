import { useState, useEffect, useContext } from 'react';
import useGTFSRealtimeData from '../hooks/useGTFSRealtimeData';
import { List, Typography } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StopItem from './StopItem';
import { RoutesContext } from '../context/RoutesContext';
import { TRIPUPDATE_DATA_URL } from '../utils/dataUrls';
import { stopsLocales } from '../utils/locales';

const RouteStops = (props) => {
	const { vehicle } = props;
	const { data, loading } = useGTFSRealtimeData(TRIPUPDATE_DATA_URL);
	const { getRouteShortName } = useContext(RoutesContext);

	const [stopsOnRoute, setStopsOnRoute] = useState([]);

	useEffect(() => {
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
		if (!loading && vehicle) getStopsOnRoute(vehicle);
	}, [vehicle, loading, data]);

	

	if (loading) return <Typography variant='body1'>{stopsLocales.loading_stops}</Typography>;
	return (
		<div>
			{stopsOnRoute.length > 0 && (
				<Accordion defaultExpanded>
					<AccordionSummary aria-controls='next-stops-panel-content' id='next-stops-panel-header' expandIcon={<ExpandMoreIcon />}>
						<Typography variant='body1' sx={{ marginRight: '5px' }}>
							{getRouteShortName(vehicle.vehicle.trip.routeId)}
						</Typography>
						<Typography variant='body1' sx={{ color: 'primary.main', marginRight: '5px', fontWeight: 'bold' }}>
							{vehicle.vehicle.vehicle.label}
						</Typography>
						<Typography variant='body1'>{stopsLocales.next_stops}</Typography>
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

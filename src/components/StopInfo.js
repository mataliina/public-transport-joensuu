import React, { useContext, useEffect, useState } from 'react';
import { StopsContext } from '../context/StopsContext';
import { Typography, List, ListItem, ListItemText, FormControlLabel, FormGroup, Checkbox } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const StopInfo = () => {
	const { getStopName, selectedStop, stopTimesData, loading } = useContext(StopsContext);
	// hae stop_times.txt -tiedostosta halutun pysäkin pysähdysajat,
	// mahdollisuus selata edelliset/seuraavat
	const [showEarlier, setShowEarlier] = useState(false);
	const [stopTimes, setStopTimes] = useState(null);

	const isInFuture = (time) => {
		if (time) {
			const now = new Date();
			const [hours, minutes, seconds] = time.split(':');
			const departureTime = new Date();
			departureTime.setHours(hours);
			departureTime.setMinutes(minutes);
			departureTime.setSeconds(seconds);
			departureTime.setMilliseconds(0);
			if (now < departureTime) return true;
			return false;
		}
	};

	useEffect(() => {
		if (stopTimesData) {
			const futureStops = stopTimesData.filter((stop) => {
				return isInFuture(stop.departure_time);
			});

			if (showEarlier) {
				setStopTimes(stopTimesData);
			} else {
				setStopTimes(futureStops);
			}
		}
	}, [showEarlier, stopTimesData]);

	const handleCheckboxChange = (event) => {
		setShowEarlier(event.target.checked);
	};

	return (
		<div>
			{loading && <div>Loading stop data...</div>}
			{stopTimes && stopTimes.length > 0 && !loading && (
				<Accordion defaultExpanded>
					<AccordionSummary
						aria-controls='stop-info-panel-content'
						id='stop-info-panel-header'
						expandIcon={<ExpandMoreIcon />}
						sx={{ color: 'primary.main' }}
					>
						<Typography variant='body1'>Lähtöajat pysäkiltä tänään</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<FormGroup>
							<FormControlLabel
								control={<Checkbox checked={showEarlier} onChange={handleCheckboxChange} />}
								label='Näytä aikaisemmat lähdöt'
							/>
						</FormGroup>
						<List sx={{ display: 'inline-block' }}>
							{stopTimes.map((stop, index) => {
								return (
									<ListItem key={index} alignItems='center' dense={true}>
										<ListItemText
											sx={{
												minWidth: '40px',
												color: isInFuture(stop.departure_time) ? 'info.main' : 'info.light',
											}}
										>
											{stop.routeId}{' '}
										</ListItemText>
										<ListItemText sx={{ color: isInFuture(stop.departure_time) ? 'text.primary' : 'text.disabled' }}>
											{stop.departure_time}
											{/*stop.trip_id ? (stop.trip_id.startsWith('koulu') ? ' K' : '') : ''*/}
										</ListItemText>
									</ListItem>
								);
							})}
						</List>
					</AccordionDetails>
				</Accordion>
			)}
		</div>
	);
};

export default StopInfo;

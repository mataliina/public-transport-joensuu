import React, { useContext, useEffect, useState } from 'react';
import { StopsContext } from '../context/StopsContext';
import { Typography, List, ListItem, ListItemText, FormControlLabel, FormGroup, Checkbox } from '@mui/material';

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
			<div>
				{selectedStop && (
					<div>
						<Typography variant='h2' color='primary'>
							{getStopName(selectedStop)}
						</Typography>
						<Typography variant='h5'>Lähtöajat pysäkiltä tänään</Typography>
						<FormGroup>
							<FormControlLabel
								control={<Checkbox checked={showEarlier} onChange={handleCheckboxChange} />}
								label='Näytä myös aikaisemmat lähdöt'
							/>
						</FormGroup>
					</div>
				)}
				{loading && <div>Loading stop data...</div>}
				{stopTimes.length > 0 && !loading && (
					<List sx={{ display: 'inline-block' }}>
						{stopTimes.map((stop, index) => {
							return (
								<ListItem key={index} alignItems='center' dense={true}>
									<ListItemText
										sx={{ minWidth: '40px', color: isInFuture(stop.departure_time) ? 'info.main' : 'info.light' }}
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
				)}
			</div>
		</div>
	);
};

export default StopInfo;

import React, { useContext } from 'react';
import { StopsContext } from '../context/StopsContext';
import { Box, ListItemButton, ListItemText, Typography } from '@mui/material';
import { stopsLocales } from '../utils/locales';

const StopItem = (props) => {
	const { index, stop } = props;

	const { selectedStop, setSelectedStop, getStopName } = useContext(StopsContext);

	const handleClick = (stopId) => {
		setSelectedStop(stopId);
	};

	return (
		<ListItemButton key={index} selected={selectedStop === stop.stopId} onClick={() => handleClick(stop.stopId)}>
			<ListItemText
				primary={
					<Box display='flex' alignItems='center'>
						<Typography variant='body1'>{getStopName(stop.stopId)}</Typography>
						<Typography variant='body2' sx={{ marginLeft: 2 }}>
							{stop.departure
								? new Date(stop.departure.time * 1000).toLocaleTimeString()
								: stop.arrival
								? `${stopsLocales.arrives} ${new Date(stop.arrival.time * 1000).toLocaleTimeString()}`
								: ''}
						</Typography>
					</Box>
				}
			></ListItemText>
		</ListItemButton>
	);
};

export default StopItem;

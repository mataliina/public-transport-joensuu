import React, { useContext } from 'react';
import { StopsContext } from '../context/StopsContext';
import { ListItemButton, ListItemText } from '@mui/material';

const StopItem = (props) => {
	const { index, stop } = props;

	const { selectedStop, setSelectedStop, getStopName } = useContext(StopsContext);

	const handleClick = (stopId) => {
		setSelectedStop(stopId);
	};

	return (
		<ListItemButton key={index} selected={selectedStop === stop.stopId} onClick={() => handleClick(stop.stopId)}>
			<ListItemText>
				<b>{getStopName(stop.stopId)}</b>{' '}
				<span>Saapuu: {stop.arrival ? new Date(stop.arrival.time * 1000).toLocaleTimeString() : 'N/A'} </span>
				<span>Lähtee: {stop.departure ? new Date(stop.departure.time * 1000).toLocaleTimeString() : 'N/A'} </span>
			</ListItemText>
		</ListItemButton>
	);
};

export default StopItem;

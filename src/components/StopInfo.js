import React, { useContext } from 'react';
import { StopsContext } from '../context/StopsContext';
import { Typography } from '@mui/material';

const StopInfo = () => {
	const { getStopName, selectedStop, stopTimesData, loading } = useContext(StopsContext);
	// hae stop_times.txt -tiedostosta halutun pysäkin pysähdysajat,
	// mahdollisuus selata edelliset/seuraavat

	return (
		<div>
			<div>
				{selectedStop && (
					<div>
						<Typography variant='h2' color='primary'>
							{getStopName(selectedStop)}
						</Typography>
					</div>
				)}
				{loading && <div>Loading stop data...</div>}
				{stopTimesData.length > 0 && !loading && (
					<div>
						{stopTimesData.map((stop, index) => {
							return <div key={index}>{stop.departure_time}</div>;
						})}
					</div>
				)}
			</div>
		</div>
	);
};

export default StopInfo;

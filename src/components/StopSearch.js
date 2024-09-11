import React, { useContext, useEffect, useState } from 'react';
import { StopsContext } from '../context/StopsContext';
import { Autocomplete, TextField } from '@mui/material';

const StopSearch = (props) => {
	const { stops, selectedStop, setSelectedStop } = useContext(StopsContext);

	const [selected, setSelected] = useState(null);
	const [inputValue, setInputValue] = useState('');

	const handleStopChange = (event, newValue) => {
		if (newValue) {
			setSelected(newValue);
			setSelectedStop(newValue.stop_id);
		} else {
			setSelectedStop('');
		}
	};

	useEffect(() => {
		const newStop = stops.find((stop) => stop.stop_id === selectedStop);
		if (newStop) {
			const newStopName = newStop.stop_name;
			setInputValue(newStopName);
			setSelected(newStop);
		} else {
			setInputValue('');
			setSelected(null);
		}
	}, [selectedStop, selected, stops]);

	return (
		<div>
			{stops && (
				<Autocomplete
					id='stop-select'
					value={selected}
					inputValue={inputValue}
					options={stops}
					getOptionLabel={(option) => option.stop_name}
					style={{ width: '100%' }}
					renderInput={(params) => <TextField {...params} label='Hae pysäkkiä' variant='outlined' />}
					onChange={handleStopChange}
					onInputChange={(event, newInputValue) => {
						if (event?.type === 'change') {
							setInputValue(newInputValue);
						}
					}}
					isOptionEqualToValue={(option, value) => value === undefined || option.stop_id === value.stop_id}
				/>
			)}
		</div>
	);
};

export default StopSearch;

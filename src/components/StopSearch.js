import React, { useContext, useEffect, useState } from 'react';
import { StopsContext } from '../context/StopsContext';
import { Autocomplete, TextField, List, ListItem, ListItemText, Box } from '@mui/material';

const StopSearch = (props) => {
	const { loading, stops, selectedStop, setSelectedStop, getStopName } = useContext(StopsContext);

	const [selected, setSelected] = useState(stops[0]);
	const [inputValue, setInputValue] = useState('');

	const handleStopChange = (event, newValue) => {
		console.log('voimassaoleva inputValue: ', inputValue);
		if (newValue) {
			console.log('newValue ', newValue);
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
	}, [selectedStop, selected]);

	return (
		<div>
			{stops && (
				<div>
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
				</div>
			)}
			{/*selectedStop && (
				<List>
					<ListItem>
						<ListItemText primary={`Selected Stop: ${getStopName(selectedStop)}`} secondary={`Stop ID: ${selectedStop} `} />
					</ListItem>
				</List>
			)*/}
		</div>
	);
};

export default StopSearch;

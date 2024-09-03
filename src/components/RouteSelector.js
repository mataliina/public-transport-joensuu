import useGTFSStaticData from '../hooks/useGTFSStaticData';
import routeUrl from '../staticlinjat/routes.txt';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { InputLabel, Typography } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const RouteSelector = (props) => {
	const { data, loading, error } = useGTFSStaticData(routeUrl);
	const { setSelectedRoute, setSelectedVehicle, setVehiclesOnRoute, selectedRoute } = props;

	const handleRouteSelect = (event) => {
		const value = event.target.value;
		setSelectedRoute(value);
		setSelectedVehicle(null);
		setVehiclesOnRoute([]);
	};

	return (
		<div>
			{!loading && data && (
				<FormControl fullWidth>
					<InputLabel id='route-select-label'>Valitse reitti</InputLabel>
					<Select onChange={handleRouteSelect} id='route-select' value={selectedRoute} displayEmpty>
						{data.map((route, index) => {
							return (
								<MenuItem key={index} value={route.route_id}>
									<Typography variant='body' sx={{ color: 'info.main', mr: 2, fontWeight: 'bold' }}>
										{route.route_short_name}
									</Typography>{' '}
									<Typography variant='body' sx={{ mr: 2 }}>
										{' '}
										{route.route_long_name}
									</Typography>{' '}
									<small> ({route.route_id})</small>
								</MenuItem>
							);
						})}
					</Select>
				</FormControl>
			)}
		</div>
	);
};

export default RouteSelector;

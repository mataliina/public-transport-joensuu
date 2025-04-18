import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { InputLabel, Typography } from '@mui/material';
import Select from '@mui/material/Select';
import { setCookie } from '../utils/cookies';
import { useContext } from 'react';
import { RoutesContext } from '../context/RoutesContext';
import { routeLocales } from '../utils/locales';

const RouteSelector = (props) => {
	const { routesData, loading } = useContext(RoutesContext);
	const { setSelectedRoute, setSelectedVehicle, setVehiclesOnRoute, selectedRoute, newRouteSelected } = props;

	const handleRouteSelect = (event) => {
		const value = event.target.value;
		setSelectedRoute(value.split(','));
		setSelectedVehicle(null);
		setVehiclesOnRoute([]);
		newRouteSelected.current = true;
		setCookie('selectedRoutes', value, 7);
	};

	return (
		<div>
			{!loading && routesData && (
				<FormControl fullWidth>
					<InputLabel id='route-select-label'>{routeLocales.select_route}</InputLabel>
					<Select onChange={handleRouteSelect} id='route-select' value={selectedRoute} displayEmpty>
						<MenuItem key={999} value={'all'}>
							<Typography variant='body' sx={{ color: 'main.dark', mr: 2, fontWeight: 'bold' }}>
								{routeLocales.show_all_routes}
							</Typography>
						</MenuItem>
						{routesData.map((route, index) => {
							return (
								<MenuItem key={index} value={route.route_ids.join(',')}>
									<Typography variant='body' sx={{ color: 'main.dark', mr: 2, fontWeight: 'bold' }}>
										{route.route_short_name}
									</Typography>{' '}
									<Typography variant='body' sx={{ mr: 2 }}>
										{' '}
										{route.routes[0].route_long_name}
									</Typography>
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

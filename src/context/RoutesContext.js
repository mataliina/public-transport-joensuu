import React, { createContext, useEffect, useState } from 'react';

export const RoutesContext = createContext();

export const RoutesProvider = ({ children }) => {
	const [routesData, setRoutesData] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		fetchRoutes();
	}, []);

	const fetchRoutes = async () => {
		try {
			const response = await fetch('/gtfs-data.json');
			if (response.ok) {
				const data = await response.json();

				// Sortataan data `route_short_name`-kentän perusteella
				const sortedData = data.routes.sort((a, b) => {
					return a.route_short_name - b.route_short_name;
				});

				// Ryhmitellään data `route_short_name`-kentän perusteella
				const groupedData = sortedData.reduce((acc, route) => {
					const { route_short_name, route_id } = route;
					if (!acc[route_short_name]) {
						acc[route_short_name] = {
							route_short_name,
							routes: [],
							route_ids: [],
						};
					}
					acc[route_short_name].routes.push(route);
					acc[route_short_name].route_ids.push(route_id);
					return acc;
				}, {});

				// Muutetaan ryhmitelty data taulukkomuotoon
				const groupedArray = Object.keys(groupedData).map((route_short_name) => ({
					route_short_name,
					routes: groupedData[route_short_name].routes,
					route_ids: groupedData[route_short_name].route_ids,
				}));

				setRoutesData(groupedArray);
			} else {
				console.error('Failed to fetch routes data:', response.statusText);
			}
		} catch (error) {
			console.error(error);
		} finally {
			console.log('routes data fetched');
			setLoading(false);
		}
	};

	const getRouteShortName = (routeId) => {
		const route = routesData.find((route) => route.route_ids.includes(routeId));
		if (route) return route.route_short_name;
		return '';
	};

	return <RoutesContext.Provider value={{ loading, routesData, getRouteShortName }}>{children}</RoutesContext.Provider>;
};

import React, { createContext, useEffect, useState } from 'react';
import Papa from 'papaparse';

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
			const response = await fetch(`/.netlify/functions/fetchGTFSStaticFiles?filename=routes.txt`);
			if (response.ok) {
				const text = await response.text();

				Papa.parse(text, {
					header: true,
					skipEmptyLines: true,
					complete: (results) => {
						const sortedData = results.data.sort((a, b) => {
							return a.route_short_name - b.route_short_name;
						});

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

						const groupedArray = Object.keys(groupedData).map((route_short_name) => ({
							route_short_name,
							routes: groupedData[route_short_name].routes,
							route_ids: groupedData[route_short_name].route_ids,
						}));

						setRoutesData(groupedArray);
						setLoading(false);
					},
					error: (error) => {
						console.error(error);
						setLoading(false);
					},
				});
			} else {
				console.error('Routes file not found or error in function');
			}
		} catch (error) {
			console.error(error);
			setLoading(false);
		}
	};

	const getRouteShortName = (routeId) => {
		if (routeId && routesData) {
			const route = routesData.find((route) => route.route_ids.includes(routeId));
			if (route) return route.route_short_name;
		}
		return '';
	};

	return <RoutesContext.Provider value={{ loading, routesData, getRouteShortName }}>{children}</RoutesContext.Provider>;
};

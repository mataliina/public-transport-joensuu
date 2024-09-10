/* NOT IN USE -- TODO: remove file later*/

import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import routes from '../staticlinjat/routes.txt';

function useGTFSStaticData(url) {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(routes);
				const csvText = await response.text();

				Papa.parse(csvText, {
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

						setData(groupedArray);
						setLoading(false);
					},
					error: (error) => {
						setError(error);
						setLoading(false);
					},
				});
			} catch (error) {
				setError(error);
				setLoading(false);
			}
		};

		fetchData();
		/*
		const intervalId = setInterval(fetchData, interval);
		return () => clearInterval(intervalId);*/
	}, [url]);

	return { data, loading, error };
}

export default useGTFSStaticData;

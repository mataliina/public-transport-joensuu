import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import routes from '../staticlinjat/routes.txt';

function useGTFSStaticData(url, interval = 5000) {
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
							console.log('a: ', a);
							return a.route_short_name - b.route_short_name;
						});
						setData(sortedData);
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
	}, [url, interval]);

	return { data, loading, error };
}

export default useGTFSStaticData;

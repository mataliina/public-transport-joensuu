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
					complete: (results) => {
						setData(results.data);
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

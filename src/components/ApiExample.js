import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ApiExample = () => {
	const [data, setData] = useState([]);

	const API_URL = 'https://data.waltti.fi';
	const token =
		'OTczNTI2MjkxNzUzNTI0MjpvSVVzV21OdWJ5NWw0YW90RDBEb1RidXhZV0UxWDE4Qg==';

	const fetchData = async () => {
		try {
			const response = await axios.get(
				API_URL + '/joensuu/api/gtfsrealtime/v1.0/feed/vehicleposition',
				{
					headers: {
						Authorization: `Basic ${token}`,
					},
				}
			);
			// Handle the response
			const result = await response;
			console.log('result: ', result);
			setData(result.data);
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	};

	useEffect(() => {
		/*
		const fetchData = async () => {
			try {
				const response = await fetch(
					API_URL + '/joensuu/api/gtfsrealtime/v1.0/feed/tripupdate'
				);
				const result = await response.json();
				setData(result);
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};*/

		fetchData();
	}, []);

	return (
		<div>
			<h1>API Data</h1>
			<p>{data}</p>
			<ul>
				{/*data.map((item) => (
					<li key={item.id}>{item.title}</li>
				))*/}
			</ul>
		</div>
	);
};

export default ApiExample;

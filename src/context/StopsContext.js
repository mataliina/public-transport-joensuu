import React, { createContext, useEffect, useState } from 'react';
import Papa from 'papaparse';
import stopsData from '../staticlinjat/stops.txt';
import stopTimesDataUrl from '../staticlinjat/stop_times.txt';
import tripsDataUrl from '../staticlinjat/trips.txt';

// Luo Context
export const StopsContext = createContext();

// Luo Context Provider -komponentti
export const StopsProvider = ({ children }) => {
	const [stops, setStops] = useState([]);
	const [selectedStop, setSelectedStop] = useState('');
	const [stopTimesData, setStopTimesData] = useState([{}]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		console.log('fetchStopTimesForStop');
		console.log('selectedStop: ', selectedStop);
		fetchStopTimesForStop(selectedStop);
	}, [selectedStop]);

	const fetchStops = async () => {
		const response = await fetch(stopsData);
		const csvText = await response.text();

		Papa.parse(csvText, {
			header: true,
			skipEmptyLines: true,
			complete: function (results) {
				setStops(results.data);
			},
			error: (error) => {
				console.error('Error parsing CSV:', error);
			},
		});
	};

	const fetchStopTimesForStop = async (stopId) => {
		setLoading(true);
		const stopTimesResponse = await fetch(stopTimesDataUrl);
		const stopTimesText = await stopTimesResponse.text();

		const tripsResponse = await fetch(tripsDataUrl);
		const tripsText = await tripsResponse.text();

		Papa.parse(stopTimesText, {
			header: true,
			complete: (stopTimesResults) => {
				Papa.parse(tripsText, {
					header: true,
					complete: (tripsResults) => {
						const stopTimes = stopTimesResults.data
							.filter((row) => row.stop_id === stopId)
							.map((stopTime) => {
								const trip = tripsResults.data.find((trip) => trip.trip_id === stopTime.trip_id);
								return {
									...stopTime,
									routeId: trip ? trip.route_id : null,
									directionId: trip ? trip.direction_id : null,
								};
							});
						setLoading(false);
						setStopTimesData(stopTimes);
					},
					error: (error) => {
						console.error('Error parsing trips.txt:', error);
					},
				});
			},
			error: (error) => {
				console.error('Error parsing stop_times.txt:', error);
			},
		});
	};

	const getStopName = (stopId) => {
		const currentStop = stops.find((stop) => stop.stop_id === stopId);
		return currentStop ? currentStop.stop_name : 'Stop name not found in context';
	};

	return (
		<StopsContext.Provider value={{ stops, getStopName, fetchStops, selectedStop, setSelectedStop, stopTimesData, loading }}>
			{children}
		</StopsContext.Provider>
	);
};

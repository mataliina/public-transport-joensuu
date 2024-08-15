import React, { createContext, useState } from 'react';
import Papa from 'papaparse';
import stopsData from '../staticlinjat/stops.txt';

// Luo Context
export const StopsContext = createContext();

// Luo Context Provider -komponentti
export const StopsProvider = ({ children }) => {
	const [stops, setStops] = useState([]);

	const fetchStops = async () => {
		const response = await fetch(stopsData);
		const csvText = await response.text();

		Papa.parse(csvText, {
			header: true,
			skipEmptyLines: true,
			complete: function (results) {
				setStops(results.data);
			},
		});
	};

	const getStopName = (stopId) => {
		//console.log('stops in context: ', stops);
		//console.log('stopId: ', stopId);
		const currentStop = stops.find((stop) => stop.stop_id === stopId);
		//console.log('currentStop: ', currentStop);
		return currentStop ? currentStop.stop_name : 'Stop name not found in context';
	};

	return <StopsContext.Provider value={{ stops, getStopName, fetchStops }}>{children}</StopsContext.Provider>;
};

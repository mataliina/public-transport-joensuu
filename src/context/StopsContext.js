import React, { useCallback, createContext, useEffect, useState } from 'react';
import { stopsLocales } from '../utils/locales';

export const StopsContext = createContext();

export const StopsProvider = ({ children }) => {
	const [stops, setStops] = useState([]);
	const [selectedStop, setSelectedStop] = useState('');
	const [stopTimesData, setStopTimesData] = useState([{}]);
	const [stopTimes, setStopTimes] = useState([]);
	const [calendar, setCalendar] = useState([]);
	const [calendarDates, setCalendarDates] = useState([]);
	const [trips, setTrips] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		try {
			const response = await fetch('/gtfs-data.json');
			const data = await response.json();
			setStops(data.stops);
			setStopTimes(data.stop_times);
			setCalendar(data.calendar);
			setCalendarDates(data.calendar_dates);
			setTrips(data.trips);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const getTodaysStopTimesForStop = useCallback(
		(stopId) => {
			// get todays services
			const today = new Date();
			const dayOfWeek = today.getDay();
			const formattedDate = today.toISOString().slice(0, 10);

			let servicesToday = [];

			const dayOfWeekToString = (dayOfWeek) => {
				const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
				return days[dayOfWeek];
			};

			calendar.forEach((service) => {
				if (new Date(getIsoDateString(service.start_date)) <= today && new Date(getIsoDateString(service.end_date)) >= today) {
					if (service[dayOfWeekToString(dayOfWeek)] === '1') {
						servicesToday.push(service.service_id);
					}
				}
			});

			calendarDates.forEach((service) => {
				if (service.date === formattedDate.replace(/-/g, '')) {
					if (service.exception_type === '1') {
						servicesToday.push(service.service_id);
					} else if (service.exception_type === '2') {
						const index = servicesToday.indexOf(service.service_id);
						if (index > -1) {
							servicesToday.splice(index, 1);
						}
					}
				}
			});

			//get todays stoptimes
			const todaysTrips = trips.filter((trip) => servicesToday.includes(trip.service_id));

			const todaysStopTimes = stopTimes.filter((stopTime) => todaysTrips.some((trip) => trip.trip_id === stopTime.trip_id));

			//get todays stop times for this stop
			const stopTimesForStop = todaysStopTimes
				.filter((row) => row.stop_id === stopId)
				.map((stopTime) => {
					const trip = trips.find((trip) => trip.trip_id === stopTime.trip_id);
					return {
						...stopTime,
						routeId: trip ? trip.route_id : null,
						directionId: trip ? trip.direction_id : null,
					};
				});

			const sortedStopTimes = stopTimesForStop.sort((a, b) => {
				return new Date(`1970-01-01T${a.departure_time}Z`).getTime() - new Date(`1970-01-01T${b.departure_time}Z`).getTime();
			});
			setStopTimesData(sortedStopTimes);
			return sortedStopTimes;
		},
		[trips, calendar, calendarDates, stopTimes]
	);

	useEffect(() => {
		getTodaysStopTimesForStop(selectedStop);
	}, [selectedStop, getTodaysStopTimesForStop]);

	const getIsoDateString = (dateString) => {
		if (dateString) return dateString.slice(0, 4) + '-' + dateString.slice(4, 6) + '-' + dateString.slice(6, 8);
		return '';
	};

	const getStopName = (stopId) => {
		const currentStop = stops.find((stop) => stop.stop_id === stopId);
		return currentStop ? currentStop.stop_name : stopsLocales.name_not_found;
	};

	return (
		<StopsContext.Provider value={{ stops, getStopName, selectedStop, setSelectedStop, stopTimesData, loading }}>
			{children}
		</StopsContext.Provider>
	);
};

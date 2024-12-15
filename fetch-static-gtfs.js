const fs = require('fs');
const JSZip = require('jszip');
const Papa = require('papaparse');

const fetchStaticGTFSData = async () => {
	const OUTPUT_FILE = './public/gtfs-data.json';
	const GTFS_URL = 'https://tvv.fra1.digitaloceanspaces.com/207.zip'; // 207 = Joensuu

	try {
		console.log('Fetching GTFS static data...');
		const response = await fetch(GTFS_URL);
		if (!response.ok) {
			throw new Error(`Failed to fetch GTFS data: ${response.statusText}`);
		}

		const blob = await response.arrayBuffer();
		const zip = await JSZip.loadAsync(blob);

		const calendarFile = zip.file('calendar.txt');
		const calendarDatesFile = zip.file('calendar_dates.txt');
		const routesFile = zip.file('routes.txt');
		const tripsFile = zip.file('trips.txt');
		const stopsFile = zip.file('stops.txt');
		const stopsTimesFile = zip.file('stop_times.txt');

		//const shapesFile = zip.file('shapes.txt');

		if (!calendarFile || !calendarDatesFile || !routesFile || !tripsFile || !stopsFile || !stopsTimesFile) {
			//|| !shapesFile
			throw new Error('Missing required GTFS files in the ZIP archive');
		}

		const calendarData = await calendarFile.async('string');
		const calendarDatesData = await calendarDatesFile.async('string');
		const routesData = await routesFile.async('string');
		const tripsData = await tripsFile.async('string');
		const stopsData = await stopsFile.async('string');
		const stopTimesData = await stopsTimesFile.async('string');

		const parsedCalendar = Papa.parse(calendarData, { header: true, skipEmptyLines: true }).data;
		const parsedCalendarDates = Papa.parse(calendarDatesData, { header: true, skipEmptyLines: true }).data;
		const parsedRoutes = Papa.parse(routesData, { header: true, skipEmptyLines: true }).data;
		const parsedTrips = Papa.parse(tripsData, { header: true, skipEmptyLines: true }).data;
		const parsedStops = Papa.parse(stopsData, { header: true, skipEmptyLines: true }).data;
		const parsedStopTimes = Papa.parse(stopTimesData, { header: true, skipEmptyLines: true }).data;

		const data = {
			calendar: parsedCalendar,
			calendar_dates: parsedCalendarDates,
			routes: parsedRoutes,
			trips: parsedTrips,
			stops: parsedStops,
			stop_times: parsedStopTimes,
		};

		fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));
		console.log('GTFS data saved to:', OUTPUT_FILE);
	} catch (error) {
		console.error('Error fetching or saving GTFS data:', error);
		process.exit(1);
	}
};

fetchStaticGTFSData();

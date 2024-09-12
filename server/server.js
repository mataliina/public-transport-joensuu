const fs = require('fs');
const https = require('https');
const cron = require('node-cron');
const express = require('express');
const path = require('path');
const AdmZip = require('adm-zip');

const app = express();

const GTFS_URL = 'https://tvv.fra1.digitaloceanspaces.com/207.zip'; // 207 = Joensuu

const ZIP_FILE_PATH = path.join(__dirname, '../data/staticlinjat.zip');
const EXTRACT_FOLDER_PATH = path.join(__dirname, '../data/gtfs/');

const downloadAndExtractGTFS = () => {
	const file = fs.createWriteStream(ZIP_FILE_PATH);
	https
		.get(GTFS_URL, (response) => {
			response.pipe(file);
			file.on('finish', () => {
				file.close();
				console.log('GTFS file loaded and saved');
				extractZipFile();
			});
		})
		.on('error', (err) => {
			fs.unlink(ZIP_FILE_PATH);
			console.error('Error loading GTFS file:', err.message);
		});
};

const extractZipFile = () => {
	try {
		const zip = new AdmZip(ZIP_FILE_PATH);
		zip.extractAllTo(EXTRACT_FOLDER_PATH, true); // Purkaa kaikki tiedostot
		console.log('GTFS zip file extracted');
	} catch (err) {
		console.error('Error extracting GTFS zip file:', err);
	}
};

cron.schedule('0 2 * * *', () => {
	// second, minute, hour, day of month, month, day of week. every day at 2: 0 2 * * *

	console.log('Loading GTFS file...');
	downloadAndExtractGTFS();
});

downloadAndExtractGTFS();

// Tarjoa staattisia tiedostoja Reactista
app.use(express.static(path.join(__dirname, '../build')));

// Palvele GTFS-dataa
app.get('/api/gtfs/:filename', (req, res) => {
	console.log('get');
	const filename = req.params.filename;
	console.log('filename: ', filename);
	const filePath = path.join(EXTRACT_FOLDER_PATH, filename);
	console.log('filePath: ', filePath);

	fs.access(filePath, fs.constants.F_OK, (err) => {
		if (err) {
			return res.status(404).send('File not found');
		}
		res.sendFile(filePath);
	});
});

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// Käynnistä palvelin
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

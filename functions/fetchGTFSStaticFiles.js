const https = require('https');
const AdmZip = require('adm-zip');
const path = require('path');
const fs = require('fs');

const GTFS_URL = 'https://tvv.fra1.digitaloceanspaces.com/207.zip'; // 207 = Joensuu
const TEMP_ZIP_PATH = '/tmp/gtfs.zip';

exports.handler = async function (event, context) {
	const { filename } = event.queryStringParameters;

	console.log('handler filename: ', filename);
	if (!filename) {
		return {
			statusCode: 400,
			body: 'No filename provided.',
		};
	}

	return new Promise((resolve, reject) => {
		const file = fs.createWriteStream(TEMP_ZIP_PATH);
		https
			.get(GTFS_URL, (response) => {
				response.pipe(file);
				file.on('finish', () => {
					file.close();
					console.log('GTFS file downloaded.');

					try {
						const zip = new AdmZip(TEMP_ZIP_PATH);
						const extractedPath = '/tmp/extracted';
						zip.extractAllTo(extractedPath, true);
						console.log('GTFS file extracted.');

						const fileToReturn = path.join(extractedPath, filename);
						if (fs.existsSync(fileToReturn)) {
							const fileContent = fs.readFileSync(fileToReturn, 'utf-8');

							resolve({
								statusCode: 200,
								body: fileContent,
							});
						} else {
							resolve({
								statusCode: 404,
								body: 'File not found',
							});
						}
					} catch (err) {
						reject({
							statusCode: 500,
							body: 'Error extracting or processing file: ' + err.message,
						});
					}
				});
			})
			.on('error', (err) => {
				reject({
					statusCode: 500,
					body: 'Error downloading file: ' + err.message,
				});
			});
	});
};

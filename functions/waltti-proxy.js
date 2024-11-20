const axios = require('axios');

exports.handler = async (event) => {
	const walttiToken = process.env.REACT_APP_API_TOKEN;
	const path = event.queryStringParameters.path;

	if (!walttiToken) {
		return {
			statusCode: 500,
			body: JSON.stringify({ error: 'Waltti token is missing.' }),
		};
	}

	const url = `https://data.waltti.fi${path}`;
	console.log('urls', url);
	try {
		const headers = {
			Authorization: `Basic ${walttiToken}`,
		};
		const response = await axios.get(url, {
			headers: headers,
			responseType: 'arraybuffer',
		});

		return {
			statusCode: 200,
			headers: {
				'Content-Type': 'application/octet-stream',
				'Content-Disposition': 'attachment',
			},
			body: response.data.toString('base64'),
			isBase64Encoded: true,
		};
	} catch (error) {
		console.error('Waltti API error:', error.message);
		return {
			statusCode: error.response?.status || 500,
			body: JSON.stringify({ error: error.message }),
		};
	}
};

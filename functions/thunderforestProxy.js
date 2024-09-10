const axios = require('axios');

exports.handler = async function (event, context) {
	const { z, x, y } = event.queryStringParameters;
	const apiKey = process.env.REACT_APP_THUNDERFOREST_API_KEY;
	const tileUrl = `https://tile.thunderforest.com/transport/${z}/${x}/${y}.png?apikey=${apiKey}`;

	try {
		const response = await axios.get(tileUrl, { responseType: 'arraybuffer' });
		return {
			statusCode: 200,
			headers: {
				'Content-Type': 'image/png',
			},
			body: response.data.toString('base64'),
			isBase64Encoded: true,
		};
	} catch (error) {
		return {
			statusCode: 500,
			body: 'Error fetching tile',
		};
	}
};

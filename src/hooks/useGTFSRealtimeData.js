import { useState, useEffect } from 'react';
import protobuf from 'protobufjs';
import axios from 'axios';
import proto from '../gtfs-realtime.proto';

const useGTFSRealtimeData = (url, interval = 5000) => {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const API_URL = 'https://data.waltti.fi';
	const token = 'OTczNTI2MjkxNzUzNTI0MjpvSVVzV21OdWJ5NWw0YW90RDBEb1RidXhZV0UxWDE4Qg==';

	useEffect(() => {
		const fetchData = async () => {
			try {
				const headers = {
					Authorization: `Basic ${token}`,
				};
				const response = await axios.get(API_URL + url, {
					headers: headers,
					responseType: 'arraybuffer',
				});

				const root = await protobuf.load(proto);
				const FeedMessage = root.lookupType('transit_realtime.FeedMessage');

				const message = FeedMessage.decode(new Uint8Array(response.data));
				setData(message);
				setLoading(false);
			} catch (error) {
				setError(error);
				setLoading(false);
			}
		};

		fetchData();

		const intervalId = setInterval(fetchData, interval);
		return () => clearInterval(intervalId);
	}, [url, interval]);

	return { data, loading, error };
};

export default useGTFSRealtimeData;

import { useState, useEffect } from 'react';
import protobuf from 'protobufjs';
import axios from 'axios';
import proto from '../gtfs-realtime.proto';
import { WALTTI_API_URL } from '../utils/dataUrls';

const useGTFSRealtimeData = (url, interval = 5000) => {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			const token = process.env.REACT_APP_API_TOKEN;
			try {
				const headers = {
					Authorization: `Basic ${token}`,
				};
				const response = await axios.get(WALTTI_API_URL + url, {
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

import { useState, useEffect } from 'react';
import protobuf from 'protobufjs';
import proto from '../gtfs-realtime.proto';

const useGTFSRealtimeData = (url, interval = 5000) => {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(`/.netlify/functions/waltti-proxy?path=${encodeURIComponent(url)}`);
				const arrayBuffer = await response.arrayBuffer();

				const root = await protobuf.load(proto);
				const FeedMessage = root.lookupType('transit_realtime.FeedMessage');
				const message = FeedMessage.decode(new Uint8Array(arrayBuffer));

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

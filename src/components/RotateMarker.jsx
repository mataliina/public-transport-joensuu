import { useEffect, useRef } from 'react';
import { Marker } from 'react-leaflet';
import L from 'leaflet';
import markerIcon from '../images/arrow_thin.png';
import 'leaflet-rotatedmarker';

const RotateMarker = (props) => {
	const markerRef = useRef(null);

	const { vehicle } = props;

	useEffect(() => {
		if (markerRef.current) {
			markerRef.current.setRotationAngle(vehicle.vehicle.position.bearing);
		}
	}, [vehicle]);

	const arrowIcon = new L.Icon({
		iconUrl: markerIcon,
		iconSize: [40, 40],
	});

	return (
		<Marker
			icon={arrowIcon}
			position={[vehicle.vehicle.position.latitude, vehicle.vehicle.position.longitude]}
			rotationAngle={vehicle.vehicle.position.bearing}
			rotationOrigin='center center'
			ref={markerRef}
			zIndexOffset={100}
		/>
	);
};

export default RotateMarker;

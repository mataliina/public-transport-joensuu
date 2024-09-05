import { useEffect, useState, useRef } from 'react';
import { Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import markerIcon from '../images/arrow_thin.png';
import 'leaflet-rotatedmarker';

const RotateMarker = (props) => {
	const markerRef = useRef(null);

	const { vehicle } = props;
	const [angle, setAngle] = useState(0);

	useEffect(() => {
		setAngle(vehicle.vehicle.position.bearing);
		if (markerRef.current) {
			markerRef.current.setRotationAngle(angle);
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
			rotationAngle={angle}
			rotationOrigin='center center'
			ref={markerRef}
			zIndexOffset={100}
		/>
	);
};

export default RotateMarker;

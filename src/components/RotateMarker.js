import { useEffect, useRef } from 'react';
import { Marker } from 'react-leaflet';
import L from 'leaflet';
import markerIcon from '../images/arrow_thin.png';

const RotateMarker = (props) => {
	const markerRef = useRef();

	const { vehicle } = props;

	const createArrowIcon = (bearing) => {
		return L.divIcon({
			className: 'arrow-icon',
			html: `<div class="marker" style="transform: rotate(${bearing}deg);"><img src="${markerIcon}" alt="Icon" class="icon" /></div>`, // HTML nuolella
			iconSize: [20, 25],
			iconAnchor: [19, 19],
		});
	};

	useEffect(() => {
		const arrowElement = document.querySelector('.arrow');
		if (arrowElement) {
			arrowElement.style.transform = `rotate(${vehicle.vehicle.position.bearing}deg)`;
		}
	}, [vehicle]);

	return (
		<Marker
			icon={createArrowIcon(vehicle.vehicle.position.bearing)}
			position={[vehicle.vehicle.position.latitude, vehicle.vehicle.position.longitude]}
			ref={markerRef}
			zIndexOffset={100}
		/>
	);
};

export default RotateMarker;

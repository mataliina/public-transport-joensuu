import { useContext } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import pinkBusIcon from '../images/pink_bus.png';
import { StopsContext } from '../context/StopsContext';

const VehicleMarker = (props) => {
	const { vehicle, setSelectedVehicle } = props;
	const { getStopName } = useContext(StopsContext);

	const busIcon = L.icon({
		iconUrl: pinkBusIcon,
		iconSize: [26, 26],
		iconAnchor: [13, 13],
	});

	const getCurrentSpeed = (speed) => {
		//return (speed * 3.6).toFixed(2);
		return Math.round(speed * 3.6);
	};

	return (
		<Marker
			position={[vehicle.vehicle.position.latitude, vehicle.vehicle.position.longitude]}
			icon={busIcon}
			eventHandlers={{
				click: (e) => {
					setSelectedVehicle(vehicle);
				},
			}}
			zIndexOffset={100}
		>
			<Popup>
				<b>
					{vehicle.vehicle.trip.routeId} {vehicle.vehicle.vehicle.label}
				</b>
				<br />

				<span>Seuraavaksi: {getStopName(vehicle.vehicle.stopId)}</span>

				<br />
				<span>Nopeus: {getCurrentSpeed(vehicle.vehicle.position.speed)} km/h</span>
			</Popup>
		</Marker>
	);
};

export default VehicleMarker;

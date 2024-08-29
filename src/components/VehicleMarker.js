import { useContext } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import icon from '../images/icons8-bus-64.png';
import { StopsContext } from '../context/StopsContext';

const VehicleMarker = (props) => {
	const { vehicle, setSelectedVehicle } = props;
	const { getStopName } = useContext(StopsContext);

	const busIcon = L.icon({
		iconUrl: icon,
		iconSize: [25, 25],
		iconAnchor: [12, 12],
	});

	const getCurrentSpeed = (speed) => {
		return (speed * 3.6).toFixed(2);
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
		>
			<Popup>
				<b>
					{vehicle.vehicle.trip.routeId} {vehicle.vehicle.vehicle.label}
				</b>
				<br />

				<span>Seuraavaksi: {getStopName(vehicle.vehicle.stopId)}</span>

				<br />
				<span>Nopeus: {getCurrentSpeed(vehicle.vehicle.position.speed)} km/h</span>
				<br />
				<span>Suunta: {vehicle.vehicle.position.bearing}</span>
			</Popup>
		</Marker>
	);
};

export default VehicleMarker;

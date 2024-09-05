import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import RotateMarker from './RotateMarker';
import VehicleMarker from './VehicleMarker';
import UserLocationMarker from './UserLocationMarker';

const FitBounds = ({ positions }) => {
	const map = useMap();
	const previousBounds = useRef(positions);
	useEffect(() => {
		if (positions.length > 0 && positions !== previousBounds.current) {
			const bounds = L.latLngBounds(positions);
			//map.fitBounds(bounds, { padding: [25, 25] });
			const padding = [22, 22];
			const maxZoom = positions.length > 1 ? null : 16;
			map.flyToBounds(bounds, { padding, maxZoom });
		}
	}, [positions, map]);
	return null;
};

// const openStreetMapUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
//attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"

const MapComponent = (props) => {
	const { vehiclesOnRoute, busPositions, setSelectedVehicle } = props;
	return (
		<MapContainer center={[62.600785, 29.763171]} zoom={13} style={{ height: '70vh', width: '100%' }}>
			<TileLayer
				url='https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=REMOVED'
				attribution='&copy; <a href="https://www.thunderforest.com/">Thunderforest</a>, <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			/>
			{vehiclesOnRoute.length > 0 &&
				vehiclesOnRoute.map((vehicle, index) => {
					return <RotateMarker vehicle={vehicle} key={index} />;
				})}
			{vehiclesOnRoute.length > 0 &&
				vehiclesOnRoute.map((vehicle, index) => {
					return <VehicleMarker vehicle={vehicle} key={index} setSelectedVehicle={setSelectedVehicle} />;
				})}
			<FitBounds positions={busPositions} />
			<UserLocationMarker />
		</MapContainer>
	);
};

export default MapComponent;

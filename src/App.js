import './App.css';
import { ThemeProvider } from '@mui/material/styles';
import VehicleMap from './components/VehicleMap';
import theme from './theme';

function App() {
	return (
		<ThemeProvider theme={theme}>
			<div className='App'>
				<VehicleMap />
			</div>
		</ThemeProvider>
	);
}

export default App;

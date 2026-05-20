import './App.css';
import { ThemeProvider } from '@mui/material/styles';
import VehicleMap from './components/VehicleMap';
import Footer from './components/Footer';
import theme from './theme';

function App() {
	return (
		<ThemeProvider theme={theme}>
			<div className='App' style={{ marginBottom: '20px' }}>
				<VehicleMap />
			</div>
			<Footer />
		</ThemeProvider>
	);
}

export default App;

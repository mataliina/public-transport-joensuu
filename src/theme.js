import { createTheme } from '@mui/material/styles';

const theme = createTheme({
	typography: {
		h1: {
			fontSize: '2.5rem',
		},
		h2: {
			fontSize: '2rem',
		},
		h3: {
			fontSize: '1.75rem',
		},
		body1: {
			fontSize: '1rem',
		},
	},
	palette: {
		primary: {
			main: '#1976d2', // Pääväri (sininen)
			light: '#63a4ff', // Vaaleampi versio pääväristä
			dark: '#004ba0', // Tummempi versio pääväristä
			contrastText: '#ffffff', // Tekstin väri päävärillä
		},
		secondary: {
			main: '#dc004e', // Toinen pääväri (punainen)
			light: '#ff616f', // Vaaleampi versio toissijaisesta väristä
			dark: '#9a0036', // Tummempi versio toissijaisesta väristä
			contrastText: '#ffffff', // Tekstin väri toissijaisella värillä
		},
		error: {
			main: '#f44336', // Virheväri
			light: '#e57373',
			dark: '#d32f2f',
			contrastText: '#ffffff',
		},
		warning: {
			main: '#ffa726', // Varoitusväri
			light: '#ffb74d',
			dark: '#f57c00',
			contrastText: '#000000',
		},
		info: {
			main: '#2196f3', // Informatiivinen väri
			light: '#64b5f6',
			dark: '#1976d2',
			contrastText: '#ffffff',
		},
		success: {
			main: '#4caf50', // Onnistumista symboloiva väri
			light: '#81c784',
			dark: '#388e3c',
			contrastText: '#ffffff',
		},
		background: {
			default: '#f5f5f5', // Sovelluksen taustaväri
			paper: '#ffffff', // Paper-komponenttien taustaväri
		},
		text: {
			primary: '#333333', // Pääteksti
			secondary: '#777777', // Toissijainen teksti
			disabled: '#9e9e9e', // Poistettu käytöstä oleva teksti
			hint: '#8c8c8c', // Vihjeteksti
		},
	},
});

export default theme;

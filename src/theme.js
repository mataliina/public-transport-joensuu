import { createTheme } from '@mui/material/styles';

const theme = createTheme({
	typography: {
		fontFamily: 'Nunito, sans-serif',
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
			main: '#5C5470', // Tumma murrettu violetti
			light: '#7E7394', // Vaaleampi violetti
			dark: '#403651', // Tummempi violetti
			contrastText: '#FFFFFF', // Tekstin väri
		},
		secondary: {
			main: '#FF6F91', // Pinkki pääväri
			light: '#FFA0B5', // Vaaleampi pinkki
			dark: '#C43D67', // Tummempi pinkki
			contrastText: '#FFFFFF', // Tekstin väri
		},
		background: {
			default: '#F2F2F2', // Neutraali taustaväri
			paper: '#FFFFFF', // Paperin (korttien) väri
		},
		text: {
			primary: '#333333', // Ensisijainen tekstin väri
			secondary: '#666666', // Toissijainen tekstin väri
		},
		error: {
			main: '#E57373',
		},
		warning: {
			main: '#FFA726',
		},
		info: {
			main: '#64B5F6',
		},
		success: {
			main: '#81C784',
		},
	},
});

export default theme;

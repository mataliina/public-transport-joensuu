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
			main: '#1976d2',
		},
		secondary: {
			main: '#dc004e',
		},
	},
});

export default theme;

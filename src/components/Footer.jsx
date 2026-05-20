import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer = () => {
	return (
		<Box
			component='footer'
			sx={{
				backgroundColor: 'background.light',
				color: 'text.secondary',
				textAlign: 'center',
				padding: 2,
				marginTop: 'auto',
			}}
		>
			<Typography variant='body2' sx={{ fontSize: '0.9rem' }}>
				Huom! Näytetty liikennedata saattaa sisältää virheitä. Tarkista tiedot ennen päätöksiä.
			</Typography>
			<Typography variant='body2' sx={{ fontSize: '0.9rem', marginTop: 1 }}>
				Tietojen lähde:{' '}
				<a
					href='https://opendata.waltti.fi/'
					target='_blank'
					rel='noopener noreferrer'
					style={{ color: '#6bbafa', textDecoration: 'none' }}
				>
					Waltti Public GTFS Realtime API
				</a>
			</Typography>
			<Typography variant='body2' sx={{ fontSize: '0.9rem', marginTop: 1 }}>
				This project uses data available under the{' '}
				<a
					href='https://creativecommons.org/licenses/by/4.0/'
					target='_blank'
					rel='noopener noreferrer'
					style={{ color: '#6bbafa', textDecoration: 'none' }}
				>
					[CC BY 4.0]
				</a>{' '}
				license
			</Typography>
			<Typography variant='body2' sx={{ fontSize: '0.9rem', marginTop: 1 }}>
				<a
					href='https://www.linkedin.com/in/kaisa-heinonen'
					target='_blank'
					rel='noopener noreferrer'
					style={{ color: '#6bbafa', textDecoration: 'none' }}
				>
					<LinkedInIcon />
				</a>
			</Typography>
		</Box>
	);
};

export default Footer;

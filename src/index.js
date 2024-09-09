import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { StopsProvider } from './context/StopsContext';
import { ErrorBoundary } from 'react-error-boundary';
import { RoutesProvider } from './context/RoutesContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<ErrorBoundary fallback={<div>Hupsistakeikkaa! Jotain meni pieleen. Kokeile ladata sivu uudestaan.</div>}>
			<RoutesProvider>
				<StopsProvider>
					<App />
				</StopsProvider>
			</RoutesProvider>
		</ErrorBoundary>
	</React.StrictMode>
);

reportWebVitals();

# Joensuu Local Bus Tracker

This project is a **React** application that allows users to track Joensuu local buses in real-time on a map. The app fetches bus location data from available sources and displays the current positions on an interactive map using **Leaflet** and **Thunderforest** maps.

## Features

- **Real-time tracking:** See the current positions of Joensuu's local buses on the map.
- **Interactive map:** Users can zoom in/out and pan across the map to explore bus routes and locations.
- **Route filtering:** Filter and view specific bus route.
- **Responsive design:** Optimized for both desktop and mobile use.

## Getting Started

Follow these instructions to set up and run the project locally on your machine.

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/en/) (v14 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/mataliina/public-transport-joensuu.git
```

2. **Navigate to the project directory:**
```bash
cd public-transport-joensuu
```

3. **Install dependencies:** 
```bash
npm install
```

Or, if you are using yarn:
```bash
yarn install
```

The app should now be running at http://localhost:3000.

### Building for Production
To create an optimized production build, run:

```bash
npm run build
```
This will create a build folder with the optimized app, ready to be deployed.

### Environment Variables
To use real-time bus data, you need an API key. Create a .env file in the project root and configure the following environment variables:

```env
REACT_APP_THUNDERFOREST_API_KEY=your_thunderforest_api_key
REACT_APP_API_TOKEN=your_gtfs_waltti_api_token
```

Make sure to replace your_thunderforest_api_key and your_gtfs_waltti_api_token with your actual Thunderforest API key and the appropriate endpoint for bus data.

### Technologies Used
- **React:** The front-end framework for building the user interface.
- **Leaflet:** A lightweight open-source library for interactive maps.
- **Thunderforest Maps:** Used to render the map and display bus locations.
- **GTFS (General Transit Feed Specification):** For real-time bus tracking data.
- **Axios:** For handling API requests to fetch bus data.
- **Material-UI:** For the UI components and responsive design.

### Future Enhancements
- Display tomorrow's departures for a specific stop
- Route search
 
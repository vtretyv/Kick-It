import React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';

const { GOOGLE_API_KEY } = require('../../../config.js');
const geocoder = require('google-geocoder');


const EventMap = withScriptjs(withGoogleMap(props =>
  <GoogleMap
    defaultZoom={13}
    defaultCenter={{ lat: 37.7749, lng: -122.4194 }}
  >
    <Marker
      position={savedLocations[0]}
    />
    <Marker
      position={savedLocations[1]}
    />
    <Marker
      position={savedLocations[2]}
    />
  </GoogleMap>));

export default EventMap;


// testing geocode

const geo = geocoder({
  key: GOOGLE_API_KEY,
});

// sample address data
const places = ['944 Market Street, San Francisco', '201 Folsom Street, San Francisco', '245 Market Street, San Francisco'];

// function retrieves lat/long of each address
const getLatLong = (arr) => {
  const locations = [];
  arr.forEach((address) => {
    geo.find(address, (err, res) => {
      locations.push(res[0].location);
    });
  });
  return locations;
};

const savedLocations = getLatLong(places);

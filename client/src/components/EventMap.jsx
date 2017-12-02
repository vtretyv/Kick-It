import React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';

const { GOOGLE_API_KEY } = require('../../../config.js');
const geocoder = require('google-geocoder');


const EventMap = withScriptjs(withGoogleMap(props =>
  (<GoogleMap
    defaultZoom={13}
    defaultCenter={{ lat: 37.7749, lng: -122.4194 }}
  >
    {props.venues.map((address, index) => {
      return <Marker
               
               key={index.toString()}
               position={address}
             />
})}
  </GoogleMap>)));

export default EventMap;


// testing geocode

const geo = geocoder({
  key: GOOGLE_API_KEY,
});

// sample address data
const places = ['944 Market Street, San Francisco', '201 Folsom Street, San Francisco', '245 Market Street, San Francisco',
  '2500 Market Street, San Francisco', '4288 24th Street San Francisco', '101 Montgomery Street San Francisco',
  '563 Ruger Street, San Francisco', '2114 Filmore Street, San Francisco', '55 Music Concourse Drive, San Francisco',
  '824 Antoinette Lane, South San Francisco'];

// function retrieves lat/long of each address
const getLatLong = (arr) => {
  const locations = [];
  arr.forEach((address) => {
    geo.find(address, (err, res) => {
      locations.push(res[0].location);
    });
  });
  console.log(locations);
  return locations;
};

const savedLocations = getLatLong(places);

// get locations from API
// https://www.eventbriteapi.com/v3/venues/15304516/?token={API_KEY}

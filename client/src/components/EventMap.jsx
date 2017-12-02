import React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';

// const { GOOGLE_API_KEY } = require('../../../config.js');
// const geocoder = require('google-geocoder');


const EventMap = withScriptjs(withGoogleMap(props =>
  (<GoogleMap
    defaultZoom={10}
    center={props.defaultLocation}
  >
    {props.venues.map((address, index) => {
      return (<Marker
        key={index.toString()}
        position={address}
      />);
})}
   </GoogleMap>)));

export default EventMap;


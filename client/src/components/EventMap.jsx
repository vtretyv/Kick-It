import React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';

const EventMap = withScriptjs(withGoogleMap(props =>
  <GoogleMap
    defaultZoom={13}
    defaultCenter={{ lat: 37.7749, lng: -122.4194 }}
  >
    <Marker
      position={{ lat: 37.783697, lng: -122.408966 }}
    />
  </GoogleMap>));

export default EventMap;


import React, { useState, useEffect } from 'react';
import { ApiService } from '../api/api';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

export default function Livemap () {
  const [position, setPosition] = useState([52.2215, 6.8937]);
  const [map, setMap] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      ApiService.lastN(['xsens-latitude', 'xsens-longitude'],
        new Date('Januari 1, 2000 20:00:00 GMT+00:00'),
        new Date('Januari 1, 2000 20:00:00 GMT+00:00'), 1).then((res) => {
        const temp = res.data;
        const latitude = temp[0]['xsens-latitude'];
        const longitude = temp[0]['xsens-longitude'];
        setPosition([latitude, longitude]);
        if (map) map.flyTo([52.231,6.8422]);
      })
    }, 2000)
    return () => clearInterval(interval)
  }, [position, map]);

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Current Location</h1>
      <MapContainer style={{ height: '80vh' }} center={position} zoom={25}
                    scrollWheelZoom={true}
                    whenCreated={map => setMap(map)}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[52.231,6.8422]}>
          <Popup>
            Last Known Location
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}



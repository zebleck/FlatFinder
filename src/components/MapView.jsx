import React, { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: null
})

// Status-based marker icons
const statusIcons = {
  'Interested': new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: null,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  }),
  'Contacted': new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: null,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  }),
  'Viewing Scheduled': new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: null,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  }),
  'Rejected': new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: null,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  })
}

const getStatusIcon = (status) => {
  return statusIcons[status] || statusIcons['Interested']
}

const MapUpdater = ({ selectedListing, listings }) => {
  const map = useMap()
  
  useEffect(() => {
    if (selectedListing && selectedListing.coordinates) {
      map.flyTo(
        [selectedListing.coordinates.lat, selectedListing.coordinates.lon], 
        15,
        { duration: 1.5 }
      )
    } else if (listings.length > 0) {
      // Fit bounds to show all markers
      const bounds = listings.map(listing => [
        listing.coordinates.lat,
        listing.coordinates.lon
      ])
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [selectedListing, listings, map])
  
  return null
}

const MapView = ({ listings, selectedListing, onSelectListing, onDeselectListing }) => {
  const defaultCenter = [51.505, -0.09]
  const defaultZoom = 13

  return (
    <div className="map-container">
      <MapContainer 
        center={defaultCenter} 
        zoom={defaultZoom} 
        style={{ height: '100%', width: '100%' }}
        eventHandlers={{
          click: onDeselectListing
        }}
      >
        <TileLayer
          attribution=''
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        <MapUpdater selectedListing={selectedListing} listings={listings} />
        
        {listings.map((listing) => (
          <Marker 
            key={listing.id}
            position={[listing.coordinates.lat, listing.coordinates.lon]}
            icon={getStatusIcon(listing.status)}
            eventHandlers={{
              click: (e) => {
                e.originalEvent.stopPropagation()
                onSelectListing(listing)
              }
            }}
          >
            <Popup>
              <p>{listing.address}</p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

export default MapView
import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { cn } from '../utils/cn';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const getMarkerIcon = (status) => {
  const color = status === 'critical' ? '#ef4444' : status === 'unhealthy' ? '#f97316' : status === 'moderate' ? '#eab308' : '#21c468';
  const pingClass = status === 'critical' ? 'animate-ping' : '';
  
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div class="relative flex h-8 w-8 items-center justify-center">
            <div class="absolute h-full w-full ${pingClass} rounded-full" style="background-color: ${color}; opacity: 0.4;"></div>
            <div class="h-4 w-4 rounded-full border-2 border-white shadow-md" style="background-color: ${color};"></div>
           </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

const indiaBounds = [
  [6.5, 68], // South West
  [37.5, 97.5], // North East
];

export default function MapUi({ sensors }) {
  return (
    <div className="relative w-full h-full z-0">
      <MapContainer 
        center={[22.5937, 78.9629]} 
        zoom={5} 
        minZoom={5}
        maxBounds={indiaBounds}
        maxBoundsViscosity={1.0}
        className="w-full h-full" 
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">Carto</a>'
        />
        
        {sensors?.map((sensor) => (
          <Marker 
            key={sensor.id} 
            position={[sensor.lat, sensor.lng]}
            icon={getMarkerIcon(sensor.status)}
          >
            <Popup className="custom-popup" minWidth={200}>
              <div className="bg-background-dark text-slate-100 p-1">
                <div className="flex items-center justify-between mb-3 border-b border-primary/10 pb-2">
                  <div className="flex flex-col">
                    <h4 className="text-sm font-bold text-primary">{sensor.name}</h4>
                    <span className="text-[10px] font-medium opacity-60 uppercase">Station {sensor.id}</span>
                  </div>
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                    sensor.status === 'critical' ? 'bg-red-500/20 text-red-500' : 
                    sensor.status === 'unhealthy' ? 'bg-orange-500/20 text-orange-500' :
                    'bg-primary/20 text-primary'
                  )}>
                    {sensor.status}
                  </span>
                </div>
                
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-black text-white">{sensor.aqi}</p>
                    <p className="text-[10px] font-bold opacity-40 uppercase tracking-tighter">Current AQI Index</p>
                  </div>
                  <div className="text-right">
                    <div className={cn(
                      "flex items-center justify-end font-bold text-sm",
                      sensor.trend > 0 ? "text-red-500" : "text-primary"
                    )}>
                      <span className="material-symbols-outlined text-sm">
                        {sensor.trend > 0 ? 'trending_up' : 'trending_down'}
                      </span>
                      {Math.abs(sensor.trend)}%
                    </div>
                    <p className="text-[10px] opacity-40">vs last hour</p>
                  </div>
                </div>
                
                <div className="mt-4 pt-3 border-t border-primary/10 flex items-center gap-2">
                  <span className="material-symbols-outlined text-xs opacity-40">schedule</span>
                  <p className="text-[10px] opacity-60 uppercase font-medium tracking-tight">Updated {sensor.updated}</p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      <style>{`
        .leaflet-container { background: #0f172a; }
        .custom-popup .leaflet-popup-content-wrapper { 
          background: #122018; 
          border: 1px solid rgba(33, 196, 104, 0.2); 
          border-radius: 1rem; 
          color: white;
          padding: 0;
          overflow: hidden;
        }
        .custom-popup .leaflet-popup-content {
          margin: 16px;
        }
        .custom-popup .leaflet-popup-tip { background: #122018; }
        .leaflet-div-icon { background: transparent; border: none; }
      `}</style>
    </div>
  );
}

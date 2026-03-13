import { useEffect, useRef, memo, useImperativeHandle, forwardRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { cn } from '../utils/cn';
import { useUserStore } from '../store/useUserStore';

// --- Leaflet Default Icon Fix ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconRetinaUrl: iconRetina,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom Icons
const userLocationIcon = L.divIcon({
  className: 'user-location-marker',
  html: `<div class="relative flex h-10 w-10 items-center justify-center">
          <div class="absolute h-full w-full animate-pulse rounded-full bg-blue-500 opacity-20"></div>
          <div class="absolute h-6 w-6 animate-ping rounded-full bg-blue-400 opacity-40"></div>
          <div class="h-4 w-4 rounded-full border-2 border-white bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.8)]"></div>
         </div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
});

const getSensorIcon = (status) => {
  const color = status === 'critical' ? '#ef4444' : status === 'unhealthy' ? '#f97316' : status === 'moderate' ? '#eab308' : '#21c468';
  const pingClass = status === 'critical' ? 'animate-ping' : '';
  
  return L.divIcon({
    className: 'sensor-marker',
    html: `<div class="relative flex h-8 w-8 items-center justify-center">
            <div class="absolute h-full w-full ${pingClass} rounded-full" style="background-color: ${color}; opacity: 0.4;"></div>
            <div class="h-4 w-4 rounded-full border-2 border-white shadow-md" style="background-color: ${color};"></div>
           </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

// --- Map Controller Helper ---
const MapController = forwardRef((props, ref) => {
  const map = useMap();
  const { detectLocation } = useUserStore();
  const hasInitialized = useRef(false);

  useImperativeHandle(ref, () => ({
    zoomIn: () => map.setZoom(map.getZoom() + 1),
    zoomOut: () => map.setZoom(map.getZoom() - 1),
    flyTo: (lat, lng, zoom = 13) => {
      map.flyTo([lat, lng], zoom, { duration: 1.5 });
    }
  }));

  // On Mount: Detect location and fly to it ONCE
  useEffect(() => {
    if (!hasInitialized.current) {
      detectLocation((loc) => {
        map.flyTo([loc.lat, loc.lng], 10, { duration: 2 });
      });
      hasInitialized.current = true;
    }
  }, [detectLocation, map]);

  return null;
});

const SensorMarker = memo(({ sensor }) => (
  <Marker 
    position={[sensor.lat, sensor.lng]}
    icon={getSensorIcon(sensor.status)}
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
            <div className={cn("flex items-center justify-end font-bold text-sm", sensor.trend > 0 ? "text-red-500" : "text-primary")}>
              <span className="material-symbols-outlined text-sm">{sensor.trend > 0 ? 'trending_up' : 'trending_down'}</span>
              {Math.abs(sensor.trend)}%
            </div>
            <p className="text-[10px] opacity-40">vs last hour</p>
          </div>
        </div>
      </div>
    </Popup>
  </Marker>
));

const MapUi = forwardRef(({ sensors }, ref) => {
  const { userLocation } = useUserStore();
  
  return (
    <div className="relative w-full h-full z-0 overflow-hidden">
      <MapContainer 
        center={[22.5937, 78.9629]} // Fixed Initial Center (India)
        zoom={5} 
        minZoom={4}
        maxBounds={[[6.5, 68], [37.5, 97.5]]}
        maxBoundsViscosity={1.0}
        className="w-full h-full" 
        zoomControl={false}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">Carto</a>'
        />
        
        <MapController ref={ref} />
        
        {/* User Location Marker */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userLocationIcon}>
            <Popup className="custom-popup">
              <div className="p-1 text-center">
                <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Your Location</p>
                <p className="text-sm font-medium text-white">{userLocation.city}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Pollution Sensors */}
        {sensors?.map((sensor) => (
          <SensorMarker key={sensor.id} sensor={sensor} />
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
        .custom-popup .leaflet-popup-content { margin: 16px; }
        .custom-popup .leaflet-popup-tip { background: #122018; }
        .leaflet-div-icon { background: transparent; border: none; }
      `}</style>
    </div>
  );
});

export default MapUi;

import { useEffect, useRef, memo, useImperativeHandle, forwardRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { cn } from '../utils/cn';
import { useUserStore } from '../store/useUserStore';

// --- EXTENDED DUMMY POLLUTION DATA (AQI STYLE) ---
const pollutionData = [
  { city: "Delhi", lat: 28.6139, lng: 77.2090, pollution: 445 },
  { city: "Noida", lat: 28.5355, lng: 77.3910, pollution: 410 },
  { city: "Gurgaon", lat: 28.4595, lng: 77.0266, pollution: 395 },
  { city: "Kanpur", lat: 26.4499, lng: 80.3319, pollution: 340 },
  { city: "Lucknow", lat: 26.8467, lng: 80.9462, pollution: 305 },
  { city: "Kolkata", lat: 22.5726, lng: 88.3639, pollution: 285 },
  { city: "Asansol", lat: 23.6739, lng: 86.9524, pollution: 260 },
  { city: "Patna", lat: 25.5941, lng: 85.1376, pollution: 275 },
  { city: "Mumbai", lat: 19.0760, lng: 72.8777, pollution: 210 },
  { city: "Pune", lat: 18.5204, lng: 73.8567, pollution: 185 },
  { city: "Ahmedabad", lat: 23.0225, lng: 72.5714, pollution: 195 },
  { city: "Hyderabad", lat: 17.3850, lng: 78.4867, pollution: 170 },
  { city: "Nagpur", lat: 21.1458, lng: 79.0882, pollution: 155 },
  { city: "Bangalore", lat: 12.9716, lng: 77.5946, pollution: 160 },
  { city: "Chennai", lat: 13.0827, lng: 80.2707, pollution: 145 },
  { city: "Coimbatore", lat: 11.0168, lng: 76.9558, pollution: 120 },
  { city: "Visakhapatnam", lat: 17.6868, lng: 83.2185, pollution: 135 },
  { city: "Bhubaneswar", lat: 20.2961, lng: 85.8245, pollution: 95 },
  { city: "Raipur", lat: 21.2514, lng: 81.6296, pollution: 150 }
];

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

// --- Helper: Linear Interpolation ---
const interpolate = (x, stops) => {
  if (x <= stops[0][0]) return stops[0][1];
  if (x >= stops[stops.length - 1][0]) return stops[stops.length - 1][1];
  for (let i = 0; i < stops.length - 1; i++) {
    const [x1, y1] = stops[i];
    const [x2, y2] = stops[i + 1];
    if (x >= x1 && x <= x2) {
      return y1 + (y2 - y1) * (x - x1) / (x2 - x1);
    }
  }
  return stops[0][1];
};

// --- Zoom Responsive Logic ---
const getCloudIcon = (pollution, zoom) => {
  // 1) Radius Scaling (zoom-based interpolation)
  const radiusMultiplierStops = [
    [3, 0.15], [5, 0.25], [7, 0.45], [9, 0.7], [11, 1.1], [13, 1.6], [15, 2.2]
  ];
  const radiusMultiplier = interpolate(zoom, radiusMultiplierStops);
  const radius = pollution * radiusMultiplier;
  const size = radius * 2;

  // 2) Blur Strength Scaling
  const blurStops = [[3, 0.25], [7, 0.45], [11, 0.65], [15, 0.85]];
  const blurFactor = interpolate(zoom, blurStops);
  const blurAmount = radius * blurFactor;

  // 3) Opacity Scaling
  const opacityStops = [[3, 0.45], [6, 0.60], [10, 0.75], [14, 0.85]];
  const opacity = interpolate(zoom, opacityStops);

  // 4) Color Logic
  let color, isCritical = false;
  if (pollution <= 100) color = '#3b82f6'; // Blue
  else if (pollution <= 200) color = '#eab308'; // Yellow
  else if (pollution <= 300) color = '#f97316'; // Orange
  else if (pollution <= 400) color = '#ef4444'; // Red
  else {
    color = '#7f1d1d'; // Deep Blood Red
    isCritical = true;
  }

  const animationClass = isCritical ? 'animate-critical-pulse' : '';
  const tint = isCritical ? `<div class="absolute -inset-1/2 rounded-full bg-red-900/10 blur-[60px]"></div>` : '';
  const centerDot = isCritical && zoom > 6 ? `<div class="absolute w-4 h-4 rounded-full bg-red-600 border border-white/40 shadow-[0_0_15px_rgba(255,0,0,1)] z-10"></div>` : '';

  return L.divIcon({
    className: 'pollution-cloud-marker',
    html: `
      <div class="relative flex items-center justify-center" style="width: ${size}px; height: ${size}px;">
        ${tint}
        <div class="absolute inset-0 rounded-full ${animationClass}" 
             style="background: radial-gradient(circle, ${color} 0%, ${color}e6 30%, ${color}66 70%, transparent 95%); 
                    filter: blur(${blurAmount}px); 
                    opacity: ${opacity};">
        </div>
        ${centerDot}
      </div>`,
    iconSize: [size, size],
    iconAnchor: [radius, radius],
    popupAnchor: [0, -20],
  });
};

// --- Map Controller & Zoom Listener ---
const MapController = forwardRef(({ onZoomChange }, ref) => {
  const map = useMap();
  const { detectLocation } = useUserStore();
  const hasInitialized = useRef(false);

  useMapEvents({
    zoomend: () => onZoomChange(map.getZoom()),
  });

  useImperativeHandle(ref, () => ({
    zoomIn: () => map.setZoom(map.getZoom() + 1),
    zoomOut: () => map.setZoom(map.getZoom() - 1),
    flyTo: (lat, lng, zoom = 13) => {
      map.flyTo([lat, lng], zoom, { duration: 1.5 });
    }
  }));

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

const PollutionCloud = memo(({ data, zoom }) => (
  <Marker 
    position={[data.lat, data.lng]}
    icon={getCloudIcon(data.pollution, zoom)}
  >
    <Popup className="custom-popup" minWidth={220}>
      <div className="bg-[#0f172a] text-slate-100 p-2">
        <div className="flex items-center justify-between mb-2 border-b border-white/10 pb-2">
          <div className="flex flex-col">
            <h4 className="text-sm font-black text-primary">{data.city}</h4>
            <span className="text-[10px] opacity-50 font-bold uppercase tracking-widest">Station Alert</span>
          </div>
          <span className={cn(
            "px-2 py-0.5 rounded text-[10px] font-black uppercase border",
            data.pollution > 400 ? 'bg-red-900 border-red-500 text-red-100' : 
            data.pollution > 300 ? 'bg-red-600/20 border-red-600/50 text-red-400' : 
            data.pollution > 200 ? 'bg-orange-600/20 border-orange-600/50 text-orange-400' :
            data.pollution > 100 ? 'bg-yellow-600/20 border-yellow-600/50 text-yellow-400' :
            'bg-blue-600/20 border-blue-600/50 text-blue-400'
          )}>
            {data.pollution > 400 ? 'Critical' : 
             data.pollution > 300 ? 'Severe' : 
             data.pollution > 200 ? 'Poor' : 
             data.pollution > 100 ? 'Moderate' : 'Good'}
          </span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl font-black text-white">{data.pollution}</p>
            <p className="text-[10px] font-bold opacity-40 uppercase tracking-tighter">Pollution Index (AQI)</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-primary">LIVE STATUS</p>
            <p className="text-[10px] opacity-40 italic">Updated Just Now</p>
          </div>
        </div>
      </div>
    </Popup>
  </Marker>
));

const MapUi = forwardRef(({ sensors }, ref) => {
  const { userLocation } = useUserStore();
  const [currentZoom, setCurrentZoom] = useState(5);
  
  return (
    <div className="relative w-full h-full z-0 overflow-hidden bg-[#0f172a]">
      <MapContainer 
        center={[22.5937, 78.9629]} 
        zoom={currentZoom} 
        minZoom={3}
        maxBounds={[[5, 65], [38, 100]]}
        maxBoundsViscosity={1.0}
        className="w-full h-full" 
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">Carto</a>'
        />
        
        <MapController ref={ref} onZoomChange={setCurrentZoom} />
        
        {/* HIGH INTENSITY ZOOM-RESPONSIVE POLLUTION CLOUDS */}
        {pollutionData.map((data, index) => (
          <PollutionCloud key={`${data.city}-${index}`} data={data} zoom={currentZoom} />
        ))}
      </MapContainer>
      
      <style>{`
        .leaflet-container { background: #0f172a; }
        .custom-popup .leaflet-popup-content-wrapper { 
          background: #0f172a; 
          border: 1px solid rgba(255, 255, 255, 0.1); 
          border-radius: 0.5rem; 
          color: white;
          padding: 0;
          overflow: hidden;
        }
        .custom-popup .leaflet-popup-content { margin: 0; }
        .custom-popup .leaflet-popup-tip { background: #0f172a; }
        .leaflet-div-icon { background: transparent; border: none; }
        
        @keyframes critical-pulse {
          0% { transform: scale(1); opacity: 0.85; }
          50% { transform: scale(1.1); opacity: 0.65; }
          100% { transform: scale(1); opacity: 0.85; }
        }
        .animate-critical-pulse {
          animation: critical-pulse 4s ease-in-out infinite;
        }

        .leaflet-marker-pane .pollution-cloud-marker {
          z-index: 50 !important;
          pointer-events: auto !important;
          mix-blend-mode: screen;
          transition: width 0.3s ease, height 0.3s ease, margin 0.3s ease;
        }
      `}</style>
    </div>
  );
});

export default MapUi;

import { useEffect, useRef, memo, useImperativeHandle, forwardRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useUserStore } from '../store/useUserStore';

// --- Regional Field Data ---
const pollutionField = [
  { lat: 29, lng: 77, value: 420 }, { lat: 28, lng: 75, value: 380 },
  { lat: 27, lng: 80, value: 360 }, { lat: 26, lng: 83, value: 300 },
  { lat: 23, lng: 88, value: 280 }, { lat: 24, lng: 86, value: 260 },
  { lat: 19, lng: 73, value: 210 }, { lat: 22, lng: 72, value: 190 },
  { lat: 17, lng: 79, value: 170 }, { lat: 21, lng: 80, value: 160 },
  { lat: 13, lng: 80, value: 150 }, { lat: 12, lng: 77, value: 155 },
  { lat: 20, lng: 85, value: 95 }, { lat: 18, lng: 83, value: 130 }
];

const CanvasHeatmapLayer = ({ data }) => {
  const map = useMap();

  useEffect(() => {
    const canvas = L.DomUtil.create('canvas', 'leaflet-heatmap-layer');
    canvas.style.cssText = 'position:absolute;pointer-events:none;z-index:10;mix-blend-mode:screen;';
    map.getPanes().overlayPane.appendChild(canvas);

    const draw = () => {
      const size = map.getSize();
      const zoom = map.getZoom();
      canvas.width = size.x; canvas.height = size.y;
      const ctx = canvas.getContext('2d', { alpha: true });
      
      const radius = Math.max(25, zoom * zoom * 1.8);
      const alpha = Math.min(0.9, 0.45 + zoom * 0.04);

      data.forEach(p => {
        const pix = map.latLngToContainerPoint([p.lat, p.lng]);
        const intensity = Math.min(p.value / 450, 1);
        
        let color = intensity > 0.7 ? '#a00000' : intensity > 0.4 ? '#ff3200' : intensity > 0.2 ? '#ffa500' : '#0096ff';
        
        const grad = ctx.createRadialGradient(pix.x, pix.y, 0, pix.x, pix.y, radius);
        grad.addColorStop(0, `${color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`);
        grad.addColorStop(1, `${color}00`);
        
        ctx.fillStyle = grad;
        ctx.fillRect(pix.x - radius, pix.y - radius, radius * 2, radius * 2);
      });
    };

    const anim = () => { draw(); requestAnimationFrame(anim); };
    const raf = requestAnimationFrame(anim);
    map.on('move zoom', draw);
    return () => { cancelAnimationFrame(raf); canvas.remove(); map.off('move zoom', draw); };
  }, [map, data]);
  return null;
};

const WindLayer = () => {
  const map = useMap();
  useEffect(() => {
    const canvas = L.DomUtil.create('canvas', 'leaflet-wind-layer');
    canvas.style.cssText = 'position:absolute;pointer-events:none;z-index:20;opacity:0.5;';
    map.getPanes().overlayPane.appendChild(canvas);
    const pts = Array.from({ length: 150 }, () => ({ x: Math.random(), y: Math.random(), s: 2.5 + Math.random() * 3.5 }));

    const frame = () => {
      const ctx = canvas.getContext('2d');
      const { x: w, y: h } = map.getSize();
      canvas.width = w; canvas.height = h;
      ctx.fillStyle = 'rgba(255, 200, 150, 0.6)';
      pts.forEach(p => {
        p.x = (p.x + p.s / w) % 1; p.y = (p.y + p.s / h) % 1;
        ctx.beginPath(); ctx.arc(p.x * w, p.y * h, 1.5, 0, 7); ctx.fill();
      });
      requestAnimationFrame(frame);
    };
    const raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); canvas.remove(); };
  }, [map]);
  return null;
};

const MapController = forwardRef((p, ref) => {
  const map = useMap();
  const { detectLocation } = useUserStore();
  useImperativeHandle(ref, () => ({
    zoomIn: () => map.zoomIn(), zoomOut: () => map.zoomOut(),
    flyTo: (lat, lng) => map.flyTo([lat, lng], 7, { duration: 1.2 })
  }));
  useEffect(() => { detectLocation(l => map.flyTo([l.lat, l.lng], 6, { duration: 1.2 })); }, []);
  return null;
});

const MapUi = forwardRef(({ sensors }, ref) => (
  <div className="relative w-full h-full bg-black">
    <MapContainer center={[22, 78]} zoom={4} className="w-full h-full" zoomControl={false} attributionControl={false}>
      <TileLayer 
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" 
        className="brightness-[0.7] contrast-[1.2]" 
      />
      <MapController ref={ref} />
      <CanvasHeatmapLayer data={pollutionField} />
      <WindLayer />
    </MapContainer>
  </div>
));

export default MapUi;

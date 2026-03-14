import { useImperativeHandle, forwardRef, memo, useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import L from 'leaflet';
import { useUserStore } from '../store/useUserStore';

// --- FULL INDIAN CITY LATITUDE-LONGITUDE DICTIONARY ---
const cityCoords = {
  "Ahmedabad": [23.0225, 72.5714],
  "Aizawl": [23.7271, 92.7176],
  "Amaravati": [16.5062, 80.6480],
  "Amritsar": [31.6340, 74.8723],
  "Bengaluru": [12.9716, 77.5946],
  "Bhopal": [23.2599, 77.4126],
  "Brajrajnagar": [21.8217, 83.9189],
  "Chandigarh": [30.7333, 76.7794],
  "Chennai": [13.0827, 80.2707],
  "Coimbatore": [11.0168, 76.9558],
  "Delhi": [28.6139, 77.2090],
  "Ernakulam": [9.9816, 76.2999],
  "Gurugram": [28.4595, 77.0266],
  "Guwahati": [26.1445, 91.7362],
  "Hyderabad": [17.3850, 78.4867],
  "Jaipur": [26.9124, 75.7873],
  "Jorapokhar": [23.6841, 86.4168],
  "Kochi": [9.9312, 76.2673],
  "Kolkata": [22.5726, 88.3639],
  "Lucknow": [26.8467, 80.9462],
  "Mumbai": [19.0760, 72.8777],
  "Nagpur": [21.1458, 79.0882],
  "Patna": [25.5941, 85.1376],
  "Pune": [18.5204, 73.8567],
  "Raipur": [21.2514, 81.6296],
  "Shillong": [25.5788, 91.8933],
  "Sonipat": [28.9931, 77.0178],
  "Talcher": [20.9500, 85.2300],
  "Thiruvananthapuram": [8.5241, 76.9366],
  "Visakhapatnam": [17.6868, 83.2185],
  "Surat": [21.1702, 72.8311],
  "Indore": [22.7196, 75.8577],
  "Kanpur": [26.4499, 80.3319],
  "Agra": [27.1767, 78.0081],
  "Varanasi": [25.3176, 82.9739],
  "Madurai": [9.9252, 78.1198],
  "Nashik": [19.9975, 73.7898],
  "Jabalpur": [23.1815, 79.9864],
  "Jodhpur": [26.2389, 73.0243],
  "Allahabad": [25.4358, 81.8463],
  "Ranchi": [23.3441, 85.3096],
  "Howrah": [22.5830, 88.3300],
  "Gwalior": [26.2124, 78.1772],
  "Vijayawada": [16.5062, 80.6480],
  "Mysuru": [12.2958, 76.6394],
  "Bhubaneswar": [20.2961, 85.8245],
  "Thane": [19.2183, 72.9781]
};

// --- HEATMAP LAYER COMPONENT ---
const HeatmapLayer = memo(() => {
  const map = useMap();

  useEffect(() => {
    let heatLayer = null;
    let isMounted = true;

    // 1. Load the CSV file "air_poll_data.csv"
    fetch("/air_poll_data.csv")
      .then(r => r.text())
      .then(csv => {
        if (!isMounted) return;

        const rows = csv.split("\n").filter(line => line.trim() !== "");
        const header = rows[0].split(",");
        
        const cityIdx = header.indexOf("City");
        const dateIdx = header.indexOf("Date");
        const aqiIdx = header.indexOf("AQI");

        if (cityIdx === -1 || dateIdx === -1 || aqiIdx === -1) {
          console.error("CSV Missing required columns (City, Date, or AQI)");
          return;
        }

        const cityDataMap = {};
        rows.slice(1).forEach(line => {
          const cols = line.split(",");
          const cityName = cols[cityIdx]?.trim();
          const dateStr = cols[dateIdx]?.trim();
          const aqi = parseFloat(cols[aqiIdx]);

          if (cityName && dateStr && !isNaN(aqi) && aqi > 0) {
            const date = new Date(dateStr);
            if (!isNaN(date.getTime())) {
              if (!cityDataMap[cityName] || date > cityDataMap[cityName].date) {
                cityDataMap[cityName] = { date, aqi };
              }
            }
          }
        });

        const heatData = [];
        Object.keys(cityDataMap).forEach(cityName => {
          const coords = cityCoords[cityName];
          if (coords) {
            const { aqi } = cityDataMap[cityName];
            
            // 5. AQI intensity scaling rules (Prevent heat fading)
            // intensity = Math.max(0.4, AQI / 300)
            let intensity = Math.max(0.4, aqi / 300);
            intensity = Math.min(1.0, intensity); // clamp to max 1.0

            heatData.push([coords[0], coords[1], intensity]);
          }
        });

        // 3. Dynamic radius calculation based on zoom level
        const getDynamicRadius = () => {
          const zoom = map.getZoom();
          // radius = map.getZoom() * 4 + 20
          return zoom * 4 + 20;
        };

        // 4, 7 & 8. Set strong heat parameters and maintain gradient
        heatLayer = L.heatLayer(heatData, {
          radius: getDynamicRadius(),
          blur: 40,
          maxZoom: 18,
          minOpacity: 0.7,
          max: 1.0,
          gradient: {
            0.2: "green",
            0.4: "yellow",
            0.6: "orange",
            0.8: "red",
            1.0: "darkred"
          }
        });

        heatLayer.addTo(map);

        // 3 & 9. Implement zoom listener to update radius dynamically
        const updateHeatRadius = () => {
          console.log("Zoom Level:", map.getZoom());
          if (heatLayer) {
            heatLayer.setOptions({ radius: getDynamicRadius() });
          }
        };

        map.on('zoomend', updateHeatRadius);

        // Clean up zoom listener on unmount
        return () => {
          map.off('zoomend', updateHeatRadius);
        };
      })
      .catch(err => console.error("Error loading CSV:", err));

    return () => {
      isMounted = false;
      if (heatLayer && map.hasLayer(heatLayer)) {
        map.removeLayer(heatLayer);
      }
    };
  }, [map]);

  return null;
});

// --- MAP CONTROLLER ---
const MapController = forwardRef((p, ref) => {
  const map = useMap();
  const { detectLocation } = useUserStore();
  
  useImperativeHandle(ref, () => ({
    zoomIn: () => map.zoomIn(), 
    zoomOut: () => map.zoomOut(),
    flyTo: (lat, lng) => map.flyTo([lat, lng], 6, { duration: 0.8 })
  }));

  useEffect(() => {
    detectLocation(l => map.flyTo([l.lat, l.lng], 6, { duration: 0.8 }));
  }, [detectLocation, map]);

  return null;
});

// --- MAIN MAP COMPONENT ---
const MapUi = forwardRef(({ sensors }, ref) => (
  <div className="relative w-full h-full bg-black">
    <MapContainer 
      center={[22, 78]} 
      zoom={4} 
      className="w-full h-full" 
      zoomControl={false} 
      attributionControl={false} 
      preferCanvas={true}
    >
      <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
      <TileLayer url="https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}" zIndex={100} />
      <MapController ref={ref} />
      <HeatmapLayer />
    </MapContainer>
  </div>
));

export default MapUi;

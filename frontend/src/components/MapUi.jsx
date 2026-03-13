import PollutionChart from "./PollutionChart";
import { useEffect, useState } from "react";
import { getPrediction } from "../services/aiService";

function MapUi() {

  const [pollutionData, setPollutionData] = useState([]);

  async function fetchPrediction() {

    const data = {
      air: {
        PM2_5: 35,
        PM10: 60,
        NO2: 25
      },
      noise: {
        traffic_density: 70
      },
      water: {
        ph: 7.2
      }
    };

    const result = await getPrediction(data);

    setPollutionData([
      {
        city: "Delhi",
        lat: 28.6139,
        lng: 77.2090,
        pollution: result.air_quality_index
      }
    ]);
  }

  useEffect(() => {
    fetchPrediction();
  }, []);

  return (
    
  <div>

    <MapContainer center={[28.6139, 77.2090]} zoom={5} style={{ height: "500px", width: "100%" }}>

      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapClickHandler onLocationClick={handleMapClick} />

      {pollutionData.map((city, index) => (
        <Marker key={index} position={[city.lat, city.lng]}>
          <Popup>
            <b>{city.city}</b><br/>
            AQI: {city.pollution}
          </Popup>
        </Marker>
      ))}

    </MapContainer>

    <h2>AI Pollution Analysis</h2>

    <PollutionChart data={pollutionData} />

  </div>
);
  
}

export default MapUi;

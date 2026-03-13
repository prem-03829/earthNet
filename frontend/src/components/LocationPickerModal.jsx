import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import Modal from './Modal';
import Button from './Button';

function MapCenterTracker({ onCenterChange }) {
  useMapEvents({
    move: (e) => {
      const center = e.target.getCenter();
      onCenterChange(center);
    },
  });
  return null;
}

export default function LocationPickerModal({ isOpen, onClose, onConfirm }) {
  const [center, setCenter] = useState({ lat: 22.5937, lng: 78.9629 });
  const [address, setAddress] = useState("India (Fetching address...)");

  useEffect(() => {
    if (isOpen) {
      setAddress(`Lat: ${center.lat.toFixed(4)}, Lng: ${center.lng.toFixed(4)}`);
    }
  }, [center, isOpen]);

  const handleConfirm = () => {
    onConfirm({ ...center, address });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Location">
      <div className="space-y-4">
        <div className="relative h-[400px] w-full rounded-xl overflow-hidden border border-slate-200 dark:border-primary/20">
          <MapContainer 
            center={[22.5937, 78.9629]} 
            zoom={15} 
            className="h-full w-full"
            zoomControl={false}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/">Carto</a>'
            />
            <MapCenterTracker onCenterChange={setCenter} />
          </MapContainer>
          
          {/* Fixed Center Pin */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1000]">
            <div className="flex flex-col items-center -translate-y-1/2">
              <span className="material-symbols-outlined text-red-500 text-5xl drop-shadow-lg">location_on</span>
              <div className="w-2 h-2 bg-red-500 rounded-full blur-[1px]"></div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-primary/5 rounded-lg border border-slate-200 dark:border-primary/10">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-primary text-sm">my_location</span>
            <span className="text-xs font-bold text-slate-400 uppercase">Selected Address</span>
          </div>
          <p className="text-sm font-medium">{address}</p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button variant="primary" className="flex-1" onClick={handleConfirm}>Confirm Location</Button>
        </div>
      </div>
    </Modal>
  );
}

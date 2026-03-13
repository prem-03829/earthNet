import Modal from './Modal';
import Button from './Button';
import { useAppStore } from '../store/useAppStore';

export default function LocationPermissionModal() {
  const { showLocationPermission, setShowLocationPermission, setUserLocation, setLocationLoading, setLocationError } = useAppStore();

  const handleRequest = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // Mock reverse geocoding
        const mockCity = "Near you"; 
        setUserLocation({ lat: latitude, lng: longitude, city: mockCity });
        setLocationLoading(false);
      },
      (error) => {
        setLocationError(error.message);
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  return (
    <Modal 
      isOpen={showLocationPermission} 
      onClose={() => setShowLocationPermission(false)}
      title="Enable Location Services"
    >
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-5xl">location_on</span>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-bold">Help us protect your local environment</h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            PrithviNet uses your location to provide real-time local pollution data, alerts for your neighborhood, and easier reporting of environmental issues.
          </p>
        </div>

        <div className="w-full flex flex-col gap-3">
          <Button variant="primary" className="w-full py-4" onClick={handleRequest}>
            Share My Location
          </Button>
          <Button variant="ghost" className="w-full" onClick={() => setShowLocationPermission(false)}>
            Continue with Default (India)
          </Button>
        </div>
        
        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
          Your privacy is protected. We only use this data within the app.
        </p>
      </div>
    </Modal>
  );
}

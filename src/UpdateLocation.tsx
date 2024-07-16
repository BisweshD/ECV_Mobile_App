import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LocationContextType {
  latitude: number;
  longitude: number;
  setLatitude: (lat: number) => void;
  setLongitude: (lng: number) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [latitude, setLatitude] = useState(37.0902);
  const [longitude, setLongitude] = useState(-95.7129);

  return (
    <LocationContext.Provider value={{ latitude, longitude, setLatitude, setLongitude }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

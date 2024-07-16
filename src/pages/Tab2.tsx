import React, { useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonLabel, IonInput, IonItem, IonFooter } from '@ionic/react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useLocation } from '../UpdateLocation';

// Import the marker images
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix default marker icon issues
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const Tab2: React.FC = () => {
  const { latitude, longitude, setLatitude, setLongitude } = useLocation();  // using custom location hook

  const handleLatChange = (e: CustomEvent) => {
    const newLat = parseFloat(e.detail.value);  // get new latitude
    if (!isNaN(newLat)) {
      setLatitude(newLat);  // update latitude
    }
  };

  const handleLngChange = (e: CustomEvent) => {
    const newLng = parseFloat(e.detail.value);  // get new longitude
    if (!isNaN(newLng)) {
      setLongitude(newLng);  // update longitude
    }
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setLatitude(e.latlng.lat);  // update latitude on map click
        setLongitude(e.latlng.lng);  // update longitude on map click
      }
    });

    return <Marker position={[latitude, longitude]}></Marker>;  // place marker at current location
  };

  const MapResizer = () => {
    const map = useMap();
    useEffect(() => {
      map.invalidateSize();  // fix map size issues
      map.setView([latitude, longitude], map.getZoom(), {
        animate: true
      });
    }, [map, latitude, longitude]);  // rerun when map or location changes
    return null;
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Region Selector</IonTitle> 
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div id="map-container">
          <MapContainer center={[latitude, longitude]} zoom={4} style={{ height: "500px", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"  // tile source
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'  // attribution
            />
            <LocationMarker /> 
            <MapResizer />  
          </MapContainer>
        </div>
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <div className="lat-lon-inputs">
            <IonItem>
              <IonLabel position="floating">Latitude</IonLabel>
              <IonInput type="number" value={latitude.toString()} onIonChange={handleLatChange} />  
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Longitude</IonLabel>
              <IonInput type="number" value={longitude.toString()} onIonChange={handleLngChange} />  
            </IonItem>
          </div>
        </IonToolbar>
      </IonFooter>
      <style>{`
        .lat-lon-inputs {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 10px;  // styling for inputs
        }
        .lat-lon-inputs ion-item {
          flex: 1;
          margin: 5px;  // individual input styling
        }
        #map-container {
          width: 100%;
          height: 500px;  // map container styling
        }
      `}</style>
    </IonPage>
  );
};

export default Tab2;

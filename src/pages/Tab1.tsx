import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonAccordion,
  IonAccordionGroup,
  IonItem,
  IonLabel,
  IonList,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import './Tab1.css';

const Tab1: React.FC = () => {
  const [expanded, setExpanded] = useState<string>("");
  const history = useHistory();

  const handleClick = async () => {
    try {
      const latitude = 33.9375;  // replace with dynamic value as needed
      const longitude = -86.9375;  // replace with dynamic value as needed
      const response = await axios.get('http://localhost:9000/hydro1/daac-bin/access/timeseries.cgi', {
        params: {
          variable: 'GPM:GPM_3IMERGHH_06:precipitationCal',
          startDate: '2009-03-27T00',
          endDate: '2010-11-23T00',
          location: `GEOM:POINT(${longitude},${latitude})`,
          type: 'asc2',
        },
      });
      const data = response.data;
      history.push('/tab3', { data, latitude, longitude });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleItemClick = (value: string) => {
    setExpanded(expanded === value ? "" : value);
    if (value === "precipitation") {
      handleClick();
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My App</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow>
            <IonCol size="3" style={{ display: 'flex', alignItems: 'center' }}>
              <img src="/assets/gesDiscLogo.png" alt="gesDisc Logo" style={{ width: '50px' }} />
            </IonCol>
            <IonCol size="9" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'right' }}>GES DISC</div>
              <div style={{ fontSize: '14px', textAlign: 'right' }}>Essential Climate Variables</div>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonAccordionGroup>
          <IonAccordion value="atmosphere">
            <IonItem slot="header" color="primary">
              <IonLabel>Atmosphere</IonLabel>
            </IonItem>
            <IonList slot="content">
              <IonItem button onClick={() => handleItemClick("precipitation")}>
                <IonLabel>Precipitation</IonLabel>
              </IonItem>
              {expanded === "precipitation" && (
                <IonList>
                  <IonItem button onClick={handleClick}><IonLabel>Global Precipitation Measurement</IonLabel></IonItem>
                </IonList>
              )}
              <IonItem><IonLabel>Water Vapor</IonLabel></IonItem>
              <IonItem><IonLabel>Aerosol Properties</IonLabel></IonItem>
              <IonItem><IonLabel>Cloud Properties</IonLabel></IonItem>
              <IonItem><IonLabel>Trace Gases</IonLabel></IonItem>
            </IonList>
          </IonAccordion>
        </IonAccordionGroup>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;

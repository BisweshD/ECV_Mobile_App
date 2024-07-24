import {
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { FormEvent, useEffect, useState } from "react";
import "./Tab1.css";

const Tab1: React.FC = () => {
  const [token, setToken] = useState("");

  useEffect(() => {
    async function callGiovanni() {
      const response = await fetch(
        "http://localhost:8080/api/configured-variables",
        {
          headers: {
            authorizationtoken: token,
          },
        },
      );

      const result = await response.text();

      console.log(result);
    }

    if (token) {
      callGiovanni();
    }
  }, [token, setToken]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const formData = new FormData(event.target as HTMLFormElement);
      const clientId = "wvKwSD-3CSt5VZoRNX9PtQ";
      const redirectUrl = "https://localhost:3000/auth";
      const authUrl = `https://urs.earthdata.nasa.gov/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUrl}`;
      const clientAuth =
        "credentials=" +
        globalThis.btoa(
          `${formData.get("username")}:${formData.get("password")}`,
        );

      // Send a request to EDL / URS to log the user in, getting an access code in return.
      const loginResponse = await fetch(authUrl, {
        body: clientAuth,
        method: "POST",
        headers: {
          "Content-Length": `${clientAuth.length}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const url = new URL(loginResponse.url);
      const code = url.searchParams.get("code");

      // Get a token from the api proxy.
      const tokenResponse = await fetch(
        `http://localhost:8080/auth?code=${code}`,
      );

      const { access_token } = await tokenResponse.json();

      // This probably needs to go into localStorage or something.
      setToken(access_token);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>EarthData Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow>
            <IonCol size="3" style={{ display: "flex", alignItems: "center" }}>
              <img
                src="/assets/gesDiscLogo.png"
                alt="gesDisc Logo"
                style={{ width: "50px" }}
              />
            </IonCol>
            <IonCol
              size="9"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  textAlign: "right",
                }}
              >
                GES DISC
              </div>
              <div style={{ fontSize: "14px", textAlign: "right" }}>
                Essential Climate Variables
              </div>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <form onSubmit={handleSubmit}>
                <p>
                  <input type="text" name="username" />
                </p>
                <p>
                  <input type="password" name="password" />
                </p>
                <p>
                  <button type="submit">Log In</button>
                </p>
              </form>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;

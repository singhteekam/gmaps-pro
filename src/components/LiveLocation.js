// import React, { useEffect, useState } from "react";
// import {
//   useJsApiLoader,
//   GoogleMap,
//   Marker,
//   Autocomplete,
//   DirectionsRenderer,
//   LoadScript,
// } from "@react-google-maps/api";
// import { useNavigate } from "react-router-dom";

// const LiveLocation = () => {
//   const [map, setMap] = useState(null);
//   const [userPosition, setUserPosition] = useState({
//     lat: 28.4595,
//     lng: 77.0266,
//   });

//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition((position) => {
//       const latitude = position.coords.latitude;
//       const longitude = position.coords.longitude;
//       const latlng = { lat: latitude, lng: longitude };
//       setUserPosition(latlng);
//       map?.panTo(latlng);
//       map?.setZoom(15);
//     });
//   }, [userPosition]);

//   const navigate= useNavigate();

//   return (
//     <>
//       <div style={{ width: "100vw", height: "100vh" }}>
//         <div style={{ width: "100vw", height: "75vh" }}>
//           {/* <LoadScript googleMapsApiKey={process.env.REACT_APP_API_KEY}> */}
//             {/* Google Map Box */}
//             <GoogleMap
//               center={userPosition}
//               zoom={15}
//               mapContainerStyle={{ width: "100%", height: "100%" }}
//               options={{
//                 zoomControl: true,
//                 streetViewControl: false,
//                 mapTypeControl: true,
//                 fullscreenControl: false,
//               }}
//               onLoad={(map) => setMap(map)}
//             >
//               {/* <Marker position={userPosition} /> */}
//               <Marker position={userPosition} onClick={()=> navigate("/route")} />
              
//             </GoogleMap>
//           {/* </LoadScript> */}
//         </div>
//       </div>
//     </>
//   );
// };

// export default LiveLocation;

import React, { useState, useEffect } from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { useNavigate } from "react-router-dom";

const LiveLocation = () => {
    const navigate= useNavigate();

  const [userLocation, setUserLocation] = useState({ lat: -33.8472767, lng: 151.2188164 });

  // Function to get the user's current location using geolocation
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting location", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  // Update location every 5 seconds to track live location
  useEffect(() => {
    // Get the user's location immediately on load
    getUserLocation();
    const interval = setInterval(getUserLocation, 3000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, [userLocation]); // Empty dependency array ensures this only runs once on mount

  // Log userLocation when it changes (for debugging purposes)
  useEffect(() => {
    if (userLocation) {
      console.log("User Location:", userLocation);
    }
  }, [userLocation]);

  return (
    <>
    <APIProvider
      apiKey={process.env.REACT_APP_API_KEY}
      onLoad={() => console.log("Maps API has loaded.")}
    >
      <h1>Live Location</h1>
      <Map
        defaultZoom={13}
        defaultCenter={userLocation}
        center={userLocation}
        onCameraChanged={(ev) =>
          console.log(
            "camera changed:",
            ev.detail.center,
            "zoom:",
            ev.detail.zoom
          )
        }
        mapId="DEMO_MAP_ID"
      >
        {userLocation && (
        <Marker position={userLocation} onClick={()=>navigate("/route")} />
      )}
      </Map>
    </APIProvider>
      
    </>
  );
};

export default LiveLocation;

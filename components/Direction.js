import React from "react";
import MapViewDirections from "react-native-maps-directions";
import { Alert } from "react-native";
const Directions = ({ destination, origin, onReady }) => (
  <MapViewDirections
    destination={destination}
    origin={origin}
    onReady={onReady}
    apikey="AIzaSyBEA31tD3pv-F9ST9rd_Tt3wGiOjzT1HmE"
    strokeWidth={3}
    strokeColor="#ffffff"
    onError={(message) => {
      Alert.alert("Error", "your Destination is out of your Continent ");
    }}
  />
);

export default Directions;

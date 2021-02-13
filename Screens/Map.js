import React, { Fragment } from "react";
import {
  View,
  StyleSheet,
  BackHandler,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  Text,
} from "react-native";
import MapView, { Marker, AnimatedRegion, Polyline } from "react-native-maps";
import * as Permissions from "expo-permissions";
import Search from "../components/Search";
import Directions from "../components/Direction";
import { getPixelSize } from "../components/utils";
import ActionButton from "react-native-action-button";
import Icon from "react-native-vector-icons/Ionicons";
import IIcon from "react-native-vector-icons/AntDesign";
import MapStyle from "../assets/MapStyle";
import {
  LocationBox,
  LocationText,
  LocationTimeBox,
  LocationTimeText,
  LocationTimeTextSmall,
} from "../components/styles";
import firebase from "../Config/firebaseConfig";
const LATITUDE_DELTA = 0.048641;
const LONGITUDE_DELTA = 0.0401;
export default class Maps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      region: null,
      destination: null,
      duration: null,
      location: null,
      loading: true,
      check: false,
      PlateNumber: null,
      coordinate: new AnimatedRegion({
        latitude: null,
        longitude: null,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }),
      latitude: null,
      longitude: null,
    };
    this.handleLocationSelected = this.handleLocationSelected.bind(this);
    this.handleBackButton = this.handleBackButton.bind(this);
  }

  async componentDidMount() {
    const { status } = await Permissions.getAsync(Permissions.LOCATION);
    if (status !== "granted") {
      const responsee = await Permissions.askAsync(Permissions.LOCATION);
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        this.setState({
          latitude: latitude,
          longitude: longitude,
          region: {
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.0143,
            longitudeDelta: 0.0134,
          },
          loading: false,
        });
      }
    );

    if (this.props.navigation.getParam("PlateNumber")) {
      firebase
        .firestore()
        .collection("vehicles")
        .where(
          "PlateNumber",
          "==",
          this.props.navigation.getParam("PlateNumber").toString()
        )
        .onSnapshot((querySnapshot) => {
          querySnapshot.docChanges().forEach((change) => {
            if (change.type === "added" || change.type === "modified") {
              var { coordinate } = this.state;
              var newCoordinate = {
                latitude: change.doc.data().Location.lat,
                longitude: change.doc.data().Location.lng,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
              };
              coordinate.timing(newCoordinate).start();
            }
          });
        });
    }
  }

  handleLocationSelected = (data, { geometry }) => {
    const {
      location: { lat: latitude, lng: longitude },
    } = geometry;

    this.setState({
      destination: {
        latitude,
        longitude,
        title: data.structured_formatting.main_text,
      },
    });
  };

  handleBackButton() {
    return true;
  }

  render() {
    console.disableYellowBox = true;
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
    const { region, destination, duration, check } = this.state;
    if (!this.state.loading) {
      return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
          <View
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "black",
            }}
          >
            <MapView
              showsUserLocation
              loadingEnabled
              ref={(el) => (this.mapView = el)}
              style={{
                width: "100%",
                height: "100%",
              }}
              region={region}
              customMapStyle={MapStyle}
            >
              {this.state.latitude && (
                <Marker.Animated
                  ref={(marker) => {
                    this.marker = marker;
                  }}
                  coordinate={this.state.coordinate}
                  image={require("../img/b.png")}
                />
              )}
              {this.props.navigation.getParam("SNearPoint") &&
              !this.props.navigation.getParam("button") &&
              this.props.navigation.getParam("Type") === "Complex" ? (
                <Marker
                  coordinate={{
                    latitude: this.props.navigation.getParam("SNearPoint").lat,
                    longitude: this.props.navigation.getParam("SNearPoint").lng,
                  }}
                  title={"Near Point"}
                  image={require("../img/s.png")}
                />
              ) : this.props.navigation.getParam("NearPoint") &&
                this.props.navigation.getParam("button") ? (
                <Marker
                  coordinate={{
                    latitude: this.props.navigation.getParam("NearPoint").lat,
                    longitude: this.props.navigation.getParam("NearPoint").lng,
                  }}
                  title={"Near Point"}
                  image={require("../img/s.png")}
                />
              ) : null}
              {(this.props.navigation.getParam("coor") &&
                this.props.navigation.getParam("button")) ||
              this.props.navigation.getParam("Type") === "Simple" ? (
                <Polyline
                  coordinates={[
                    ...this.props.navigation
                      .getParam("coor")
                      .map((value, index) => {
                        return { latitude: value.lat, longitude: value.lng };
                      }),
                  ]}
                  strokeColor="#C23810"
                  strokeWidth={5}
                />
              ) : this.props.navigation.getParam("Scoor") &&
                !this.props.navigation.getParam("button") ? (
                <Polyline
                  coordinates={[
                    ...this.props.navigation
                      .getParam("Scoor")
                      .map((value, index) => {
                        return { latitude: value.lat, longitude: value.lng };
                      }),
                  ]}
                  strokeColor="#C23810"
                  strokeWidth={5}
                />
              ) : null}
              {destination && (
                <Fragment>
                  <Directions
                    origin={region}
                    destination={destination}
                    onReady={(result) => {
                      this.setState({
                        duration: Math.floor(result.duration),
                        check: true,
                      });

                      this.mapView.fitToCoordinates(result.coordinates, {
                        edgePadding: {
                          right: getPixelSize(50),
                          left: getPixelSize(50),
                          top: getPixelSize(50),
                          bottom: getPixelSize(50),
                        },
                      });
                    }}
                  />
                  <Marker coordinate={destination} anchor={{ x: 0, y: 0 }}>
                    <LocationBox>
                      <LocationText>{destination.title}</LocationText>
                    </LocationBox>
                  </Marker>

                  <Marker coordinate={region} anchor={{ x: 0, y: 0 }}>
                    <LocationBox>
                      <LocationTimeBox>
                        <LocationTimeText>{duration}</LocationTimeText>
                        <LocationTimeTextSmall>MIN</LocationTimeTextSmall>
                      </LocationTimeBox>
                    </LocationBox>
                  </Marker>
                </Fragment>
              )}
            </MapView>
            <View
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
              }}
            >
              {this.props.navigation.getParam("flag") ? null : (
                <Search onLocationSelected={this.handleLocationSelected} />
              )}

              {check ? (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.bubbleConfirmTrip, styles.button]}
                    onPress={() => {
                      this.props.navigation.pop(1);
                      this.props.navigation.push("TripList", {
                        Origin: this.state.region,
                        Destination: this.state.destination,
                      });
                    }}
                  >
                    <Text style={{ fontSize: 17 }}>Confirm</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
              {this.props.navigation.getParam("button") ? (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.bubbleSecondTrip, styles.button]}
                    onPress={() => {
                      this.props.navigation.pop(1);
                      this.props.navigation.push("BusList", {
                        PreviousScreen: "Maps",
                        TripNumber: 2,
                        Firstcode: this.props.navigation.getParam(
                          "FirstTripCode"
                        ),
                        NearPoint: this.props.navigation.getParam("NearPoint"),
                        Secondcode: this.props.navigation.getParam(
                          "SecondTripCode"
                        ),
                        SNearPoint: this.props.navigation.getParam(
                          "SNearPoint"
                        ),
                        Type: this.props.navigation.getParam("Type"),
                        coor: this.props.navigation.getParam("coor"),
                        Scoor: this.props.navigation.getParam("Scoor"),
                      });
                    }}
                  >
                    <Text style={{ fontSize: 17 }}>Second Trip</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
              {this.props.navigation.getParam("TripEnd") ? (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.bubbleEndTrip, styles.button]}
                    onPress={() => {
                      this.props.navigation.pop(1);
                      this.props.navigation.push("Maps");
                    }}
                  >
                    <Text style={{ fontSize: 17 }}>End Trip</Text>
                  </TouchableOpacity>
                </View>
              ) : null}

              <ActionButton buttonColor="rgba(231,76,60,1)">
                <ActionButton.Item
                  buttonColor="#9b59b6"
                  title="Edit Profile"
                  onPress={() => this.props.navigation.navigate("Edit")}
                >
                  <Icon name="md-create" style={styles.actionButtonIcon} />
                </ActionButton.Item>
                <ActionButton.Item
                  buttonColor="#357C5E"
                  title="Change Password"
                  onPress={() =>
                    this.props.navigation.navigate("ChangePassword")
                  }
                >
                  <IIcon name="lock" style={styles.actionButtonIcon} />
                </ActionButton.Item>
                <ActionButton.Item
                  buttonColor="#3498db"
                  title="Logout"
                  onPress={() => {
                    BackHandler.removeEventListener(
                      "hardwareBackPress",
                      this.handleBackButton
                    );
                    this.props.navigation.pop(1);
                    this.props.navigation.push("Logout");
                  }}
                >
                  <IIcon name="logout" style={styles.actionButtonIcon} />
                </ActionButton.Item>
              </ActionButton>
            </View>
          </View>
        </SafeAreaView>
      );
    } else
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            backgroundColor: "black",
          }}
        >
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      );
  }
}
const styles = StyleSheet.create({
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: "white",
  },
  textLogin: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  animation: {
    opacity: 0.8,
    backgroundColor: "#2c8233",
    paddingVertical: 10,
    marginTop: 10,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  bubbleEndTrip: {
    flex: 1,
    backgroundColor: "rgba(219,35,29,0.7)",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  bubbleSecondTrip: {
    flex: 1,
    backgroundColor: "#999409",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
    opacity: 0.9,
  },
  bubbleConfirmTrip: {
    flex: 1,
    backgroundColor: "#084418",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
    opacity: 0.9,
  },
  button: {
    width: 250,
    paddingHorizontal: 12,
    alignItems: "center",
    marginHorizontal: 45,
    marginVertical: 35,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    backgroundColor: "transparent",
  },
});

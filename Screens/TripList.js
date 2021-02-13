import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  BackHandler,
  FlatList,
  SafeAreaView,
  ImageBackground,
} from "react-native";
import axios from "axios";
import BB from "react-native-gradient-buttons";

var Origin, Destination;
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Trips: null,
      Loading: false,
      ApiError: false,
    };
    this.GetItem = this.GetItem.bind(this);
    this.FlatListItemSeparator = this.FlatListItemSeparator.bind(this);
  }

  async componentDidMount() {
    Origin = this.props.navigation.getParam("Origin");
    Destination = this.props.navigation.getParam("Destination");
    await axios
      .post(
        "https://us-central1-test-4a236.cloudfunctions.net/SearchAlgorithm",
        {
          OriginLat: Origin.latitude,
          OriginLong: Origin.longitude,
          DestinationLat: Destination.latitude,
          DestinationLong: Destination.longitude,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (res.data.Status === "OK") {
          this.setState({
            Trips: res.data.Trips,
            Loading: true,
            ApiError: false,
          });
        } else {
          this.setState({
            ApiError: res.data.Messenge,
            Loading: true,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  GetItem(item) {
    if (item.Type === "Simple") {
      if (item.Trip.Type === "Route") {
        this.props.navigation.navigate("BusList", {
          PreviousScreen: "TripList",
          Firstcode: item.Trip.TripCode,
          Nearpoint: item.Trip.NearPoint,
          Type: item.Type,
          coor: item.Trip.Coordinates,
        });
      } else {
        this.props.navigation.navigate("BusList", {
          PreviousScreen: "TripList",
          Firstcode: item.Trip.TripCode,
          Type: item.Type,
          coor: item.Trip.Coordinates,
        });
      }
    } else {
      if (item.FirstTrip.Type === "Route" && item.SecondTrip.Type === "Route") {
        this.props.navigation.navigate("BusList", {
          PreviousScreen: "TripList",
          TripNumber: 1,
          Firstcode: item.FirstTrip.TripCode,
          Nearpoint: item.FirstTrip.NearPoint,
          Secondcode: item.SecondTrip.TripCode,
          SNearPoint: item.SecondTrip.NearPoint,
          Type: item.Type,
          coor: item.FirstTrip.Coordinates,
          Scoor: item.SecondTrip.Coordinates,
        });
      } else if (
        item.FirstTrip.Type === "Route" &&
        item.SecondTrip.Type !== "Route"
      ) {
        this.props.navigation.navigate("BusList", {
          PreviousScreen: "TripList",
          TripNumber: 1,
          Firstcode: item.FirstTrip.TripCode,
          Nearpoint: item.FirstTrip.NearPoint,
          Secondcode: item.SecondTrip.TripCode,
          SNearPoint: false,
          Type: item.Type,
          coor: item.FirstTrip.Coordinates,
          Scoor: item.SecondTrip.Coordinates,
        });
      } else if (
        item.FirstTrip.Type !== "Route" &&
        item.SecondTrip.Type === "Route"
      ) {
        this.props.navigation.navigate("BusList", {
          PreviousScreen: "TripList",
          TripNumber: 1,
          Firstcode: item.FirstTrip.TripCode,
          Nearpoint: false,
          Secondcode: item.SecondTrip.TripCode,
          SNearPoint: item.SecondTrip.NearPoint,
          Type: item.Type,
          coor: item.FirstTrip.Coordinates,
          Scoor: item.SecondTrip.Coordinates,
        });
      } else {
        this.props.navigation.navigate("BusList", {
          PreviousScreen: "TripList",
          TripNumber: 1,
          Firstcode: item.FirstTrip.TripCode,
          Nearpoint: false,
          Secondcode: item.SecondTrip.TripCode,
          SNearPoint: false,
          Type: item.Type,
          coor: item.FirstTrip.Coordinates,
          Scoor: item.SecondTrip.Coordinates,
        });
      }
    }
  }

  FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#C8C8C8",
        }}
      />
    );
  };

  render() {
    console.disableYellowBox = true;
    if (this.state.Loading) {
      if (this.state.ApiError) {
        return (
          <SafeAreaView style={{ flex: 1 }}>
            <ImageBackground
              source={require("../img/Error.jpg")}
              style={{ flex: 1 }}
              resizeMode="cover"
            >
              <View style={[styles.header, { marginVertical: 690 }]}>
                <Text
                  style={{
                    fontSize: 22,
                    justifyContent: "center",
                    alignItems: "center",
                    color: "white",
                  }}
                >
                  {this.state.ApiError}
                </Text>
                <BB
                  style={{
                    marginVertical: 310,
                    marginHorizontal: 20,
                    opacity: 0.6,
                  }}
                  text="Back"
                  width="90%"
                  deepBlue
                  impact
                  onPressAction={() => {
                    this.props.navigation.pop(1);
                    this.props.navigation.push("Maps");
                  }}
                />
              </View>
            </ImageBackground>
          </SafeAreaView>
        );
      } else {
        return (
          <SafeAreaView style={{ flex: 1 }}>
            <View style={{ backgroundColor: "black", flex: 1 }}>
              <View style={styles.MainContainer}>
                <FlatList
                  data={this.state.Trips}
                  ItemSeparatorComponent={this.FlatListItemSeparator}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={this.GetItem.bind(this, item)}>
                      <View>
                        {item.Type == "Simple" ? (
                          <View>
                            <View style={styles.header}>
                              <Text style={styles.header}>
                                ~~ One Vehicle ~~
                              </Text>
                            </View>
                            <Text style={styles.item}>
                              TripCode: {item.Trip.TripCode}
                            </Text>
                            <Text style={styles.item}>
                              From: {item.Trip.Origin}
                            </Text>
                            <Text style={styles.item}>
                              To: {Destination.title}
                            </Text>
                          </View>
                        ) : (
                          <View>
                            <View style={styles.header}>
                              <Text style={styles.header}>
                                ~~ Two Vehicles ~~
                              </Text>
                            </View>
                            <Text style={styles.item}>
                              TripCode: {item.FirstTrip.TripCode}
                            </Text>
                            <Text style={styles.item}>
                              From: {item.FirstTrip.Origin}
                            </Text>
                            <Text style={styles.item}>
                              To: {item.FirstTrip.Destination}
                            </Text>
                            <Text style={styles.item}></Text>
                            <Text style={styles.item}>
                              TripCode: {item.SecondTrip.TripCode}
                            </Text>
                            <Text style={styles.item}>
                              From: {item.SecondTrip.Origin}
                            </Text>
                            <Text style={styles.item}>
                              To: {Destination.title}
                            </Text>
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
                <View
                  style={{
                    height: 1,
                    width: "100%",
                    backgroundColor: "#C8C8C8",
                  }}
                />
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.pop(1);
                    this.props.navigation.push("Maps");
                  }}
                >
                  <Text style={styles.item}>Back</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        );
      }
    } else {
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
}
const styles = StyleSheet.create({
  MainContainer: {
    justifyContent: "center",
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    marginTop: 30,
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    padding: 10,
    fontSize: 20,
    height: 55,
  },
  item: {
    color: "white",
    padding: 10,
    fontSize: 17,
    height: 43,
  },
});

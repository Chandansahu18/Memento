import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import bgImage from "../../assets/Images/IndexScreenBackgroundImage.jpg";
import buttonImage from "../../assets/Images/GoToHomeScreenButtonIcon.png";
import { StatusBar } from "expo-status-bar";

SplashScreen.preventAutoHideAsync();

const IndexScreen = () => {
  const navigation = useNavigation();
  const [loaded, error] = useFonts({
    Black: require("../../assets/Fonts/Black.ttf"),
    Bold: require("../../assets/Fonts/Bold.ttf"),
    ExtraBold: require("../../assets/Fonts/ExtraBold.ttf"),
    ExtraLight: require("../../assets/Fonts/ExtraLight.ttf"),
    Light: require("../../assets/Fonts/Light.ttf"),
    Medium: require("../../assets/Fonts/Medium.ttf"),
    Regular: require("../../assets/Fonts/Regular.ttf"),
    SemiBold: require("../../assets/Fonts/SemiBold.ttf"),
    Thin: require("../../assets/Fonts/Thin.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <SafeAreaView style={styles.SafeAreaContainer}>
      <View style={styles.Container}>
        <StatusBar style="auto" />
        <View style={styles.HeadingContainer}>
          <Text style={styles.HeadingText}>Memento</Text>
        </View>
        <View style={styles.bgImageContainer}>
          <Image source={bgImage} style={styles.bgImage} />
        </View>
        <View style={styles.FooterContainer}>
          <Text style={styles.FooterText}>
            Capture the memories wherever you go
          </Text>
          <View style={styles.ButtonContainer}>
            <TouchableOpacity
              style={styles.GoToHomeScreenButton}
              onPress={() => navigation.navigate("Home")}
            >
              <Image source={buttonImage} style={styles.buttonImage} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default IndexScreen;

const styles = StyleSheet.create({
  SafeAreaContainer: {
    flex: 1,
    backgroundColor: "#435182",
  },
  Container: {
    flex: 1,
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    alignItems: "center",
  },
  HeadingContainer: {
    backgroundColor: "#435182",
    height: "20%",
    width: Dimensions.get("window").width,
    alignItems: "center",
    justifyContent: "center",
  },
  HeadingText: {
    fontSize: 40,
    fontFamily: "ExtraBold",
    color: "white",
  },
  bgImageContainer: {
    height: "55%",
    width: Dimensions.get("window").width,
  },
  bgImage: {
    height: "100%",
    width: "100%",
    objectFit: "cover",
  },
  FooterContainer: {
    backgroundColor: "#EF8E7D",
    height: "25%",
    width: Dimensions.get("window").width,
  },
  FooterText: {
    height: 50,
    width: "100%",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 15,
    fontFamily: "Bold",
    color: "white",
  },
  ButtonContainer: {
    height: "75%",
    width: Dimensions.get("window").width,
    alignItems: "flex-end",
    paddingRight: 15,
    justifyContent: "center",
  },
  GoToHomeScreenButton: {
    backgroundColor: "#445281",
    height: 70,
    width: 70,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  buttonImage: {
    height: "30%",
    width: "30%",
    objectFit: "contain",
    tintColor: "white",
  },
});

import React from "react";
import { StyleSheet, View, Dimensions, Image, Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Video from 'react-native-video';
import goBackButtonIcon from "../../assets/Images/goBackButtonIcon.png";

const SavedMediaPreviewScreen = ({ navigation, route }) => {
  const { media } = route.params;

  const renderMedia = () => {
    if (media.type === 'photo') {
      return (
        <Image 
          source={{ uri: `file://${media.path}` }} 
          style={[styles.photoPreview,styles.backgroundColor]} 
          resizeMode="contain"
        />
      );
    } else if (media.type === 'video') {
      return (
        <Video
          source={{ uri: media.path }}
          style={styles.videoPreview}
          resizeMode="contain"
          controls={true}
        />
      );
    }
  };

  return (
    <SafeAreaView style={styles.SafeContainer}>
      <View style={styles.container}>
        <View style={styles.HeaderContainer}>
          <Pressable
            style={styles.goBackButton}
            onPress={() => navigation.goBack()}
          >
            <Image source={goBackButtonIcon} style={styles.goBackButtonIcon} />
          </Pressable>
        </View>

        <View style={styles.mediaContainer}>
          {renderMedia()}
        </View>
        <View style={styles.FooterContainer}>
           {media.type === 'photo' ? <Text style={styles.timestamp}>Captured on: {new Date(media.timestamp).toLocaleString()}</Text> : <Text style={styles.timestamp}>Recorded on: {new Date(media.timestamp).toLocaleString()}</Text> }
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SavedMediaPreviewScreen;

const styles = StyleSheet.create({
  SafeContainer: {
    flex: 1,
    backgroundColor: "#445281",
  },
  container: {
    flex: 1,
    backgroundColor: "black",
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
  },
  HeaderContainer: {
    backgroundColor: "#445281",
    height: Dimensions.get("window").height * 0.1,
    width: Dimensions.get("window").width,
    justifyContent: "center",
    paddingLeft: 15,
},
goBackButton: {
    height: "50%",
    width: "10%",
    justifyContent: "center",
},
goBackButtonIcon: {
    height: 20,
    width: 20,
    tintColor: "white",
},
mediaContainer: {
    height: Dimensions.get("window").height * 0.82,
    width: Dimensions.get("window").width,
    justifyContent: 'center',
    alignItems: 'center',
},
videoPreview:{
    width: '100%',
    height: '100%',
},
backgroundColor:{
    backgroundColor:'#445281'
},
photoPreview:{
    width: '100%',
    height: '100%',
  },
  FooterContainer: {
    backgroundColor: "#445281",
    height: Dimensions.get("window").height * 0.1,
    width: Dimensions.get("window").width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timestamp: {
    color: 'white',
    fontSize: 14,
    fontFamily:'Regular'
  },
});
import React, { useEffect } from "react";
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Video from "react-native-video";
import {
  selectSavedMedia,
  selectMediaStatus,
  selectMediaError,
  loadSavedMedia,
} from "../reducer/savedPhotoSlice";
import { SafeAreaView } from "react-native-safe-area-context";
import { Dimensions } from "react-native";

const SavedMediaTab = ({ navigation }) => {
  const dispatch = useDispatch();
  const savedMedia = useSelector(selectSavedMedia);
  const status = useSelector(selectMediaStatus);
  const error = useSelector(selectMediaError);

  useEffect(() => {
    if (status === "idle") {
      dispatch(loadSavedMedia());
    }
  }, [status, dispatch]);

  const handleModal = () => {
    setShowModal(true);
  };

  const renderMediaItem = ({ item }) => (
    <TouchableOpacity
      style={styles.mediaItem}
      onPress={() => navigation.navigate("SavedMediaPreview", { media: item })}
    >
      {item.type === "photo" ? (
        <Image
          source={{ uri: `file://${item.path}` }}
          style={styles.photoThumbnail}
        />
      ) : (
        <Video
          source={{ uri: item.path }}
          style={styles.videoThumbnail}
          paused={true}
          resizeMode="cover"
        />
      )}
      <Text style={styles.timestamp}>
        {new Date(item.timestamp).toLocaleString()}
      </Text>
    </TouchableOpacity>
  );

  if (status === "loading") {
    return (
      <SafeAreaView style={styles.SafeContainer}>
        <View style={[styles.container, styles.centered]}>
          <ActivityIndicator size="large" color="#445281" />
        </View>
      </SafeAreaView>
    );
  }

  if (status === "failed") {
    return (
      <SafeAreaView style={styles.SafeContainer}>
        <View style={[styles.container, styles.centered]}>
          {Alert.alert(`Error in storing the media`, error)}
        </View>
      </SafeAreaView>
    );
  }

  if (savedMedia.length === 0) {
    return (
      <SafeAreaView style={styles.SafeContainer}>
        <View style={[styles.container]}>
          <View style={styles.HeaderContainer}>
            <Text style={styles.HeadingText}>Saved Media</Text>
          </View>
          <View style={styles.Emptycontainer}>
          <Text style={styles.Text}>No saved media found.</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.SafeContainer}>
      <View style={styles.container}>
        <View style={styles.HeaderContainer}>
          <Text style={styles.HeadingText}>Saved Media</Text>
        </View>
        <FlatList
          data={savedMedia}
          renderItem={renderMediaItem}
          keyExtractor={(item) => item.timestamp}
          numColumns={3}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  SafeContainer: {
    flex: 1,
    backgroundColor: "#445281",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  HeaderContainer: {
    backgroundColor: "#445281",
    height: Dimensions.get("window").height * 0.09,
    width: Dimensions.get("window").width,
    justifyContent: "center",
    paddingLeft: 15,
  },
  HeadingText: {
    fontSize: 20,
    fontFamily: "Bold",
    color: "white",
  },
  Emptycontainer:{
    flex:1,
  backgroundColor:'white',
  alignItems:'center',
  justifyContent:'center'
  },
  Text: {
    fontSize: 15,
    fontFamily: "Regular",
  },
  mediaItem: {
    flex: 1/3,
    aspectRatio: 1,
    margin: 4,
    backgroundColor: "#EAF0F1",
    borderRadius: 10,
  },
  photoThumbnail: {
    flex: 1,
    resizeMode: "cover",
    borderRadius: 10,
  },
  videoThumbnail: {
    flex: 1,
    resizeMode: "cover",
    borderRadius: 10,
  },
  timestamp: {
    position: "absolute",
    bottom: 5,
    right: 3,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    color: "white",
    padding: 2,
    fontSize: 10,
    fontFamily: "Regular",
  },
});

export default SavedMediaTab;

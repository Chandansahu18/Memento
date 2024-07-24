import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  Modal,
  Alert,
  Linking,
  Dimensions,
} from "react-native";
import { Camera, useCameraDevices } from "react-native-vision-camera";
import { useDispatch } from "react-redux";
import { saveMedia as saveMediaAction } from "../reducer/savedPhotoSlice";
import Video from "react-native-video";
import { SafeAreaView } from "react-native-safe-area-context";
import CameraShutterIcon from "../../assets/Images/CameraShutterIcon.png";
import videoRecordingButtonIcon from "../../assets/Images/videoRecordingButtonIcon.png";
import videoRecordingOnIcon from "../../assets/Images/videoRecordingOnIcon.png";
import CameraFlipButtonIcon from "../../assets/Images/CameraFlipButtonIcon.png";
import PauseButtonIcon from "../../assets/Images/PauseButtonIcon.png";
import PlayButtonIcon from "../../assets/Images/PlayButtonIcon.png";

const CameraScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCamera, setHasCamera] = useState(false);
  const [manualDevice, setManualDevice] = useState(null);
  const [previewMedia, setPreviewMedia] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isCameraRestricted, setIsCameraRestricted] = useState(false);
  const [isSwitchingCamera, setIsSwitchingCamera] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);

  const camera = useRef(null);
  const videoRef = useRef(null);
  const devices = useCameraDevices();
  const device = isFrontCamera ? devices.front : devices.back;

  useEffect(() => {
    const setupCamera = async () => {
      try {
        const hasPermissions = await checkPermissions();
        if (hasPermissions) {
          await checkAvailableDevices();
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error setting up camera:", error);
        Alert.alert("Error", "Failed to set up camera. Please try again.");
      }
    };

    setupCamera();
  }, [isFrontCamera]);

  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);

  const checkPermissions = async () => {
    try {
      const cameraStatus = await Camera.requestCameraPermission();
      const microphoneStatus = await Camera.requestMicrophonePermission();

      if (cameraStatus === "restricted" || microphoneStatus === "restricted") {
        setIsCameraRestricted(true);
        setIsLoading(false);
        return false;
      }

      if (cameraStatus === "denied" || microphoneStatus === "denied") {
        Alert.alert(
          "Permissions Required",
          "Camera and microphone permissions are required to use this app. Please grant them in your device settings.",
          [
            {
              text: "Cancel",
              style: "cancel",
              onPress: () => navigation.goBack(),
            },
            { text: "Open Settings", onPress: () => Linking.openSettings() },
          ]
        );
        return false;
      } else if (cameraStatus === "granted" && microphoneStatus === "granted") {
        return true;
      }
    } catch (error) {
      console.error("Error requesting permissions:", error);
      Alert.alert(
        "Error",
        "Failed to request camera permissions. Please try again."
      );
      return false;
    }
  };

  const checkAvailableDevices = async () => {
    try {
      const availableDevices = Camera.getAvailableCameraDevices();
      setHasCamera(availableDevices.length > 0);
      if (availableDevices.length > 0) {
        const preferredDevice = isFrontCamera
          ? availableDevices.find((d) => d.position === "front")
          : availableDevices.find((d) => d.position === "back");
        setManualDevice(preferredDevice || availableDevices[0]);
      }
    } catch (error) {
      console.error("Error checking available devices:", error);
      Alert.alert(
        "Error",
        "Failed to check available camera devices. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const capturePhoto = async () => {
    if (!(await checkPermissions())) {
      return;
    }
    try {
      const photo = await camera.current.takePhoto();
      setPreviewMedia({ path: photo.path, type: "photo" });
      setShowPreview(true);
    } catch (error) {
      console.error("Error capturing photo:", error);
      Alert.alert("Error", "Failed to capture photo. Please try again.");
    }
  };

  const handleSaveMedia = async () => {
    try {
      const newMedia = {
        path: previewMedia.path,
        type: previewMedia.type,
        timestamp: new Date().toISOString(),
      };
      await dispatch(saveMediaAction(newMedia)).unwrap();
      setShowPreview(false);
      setPreviewMedia(null);
    } catch (error) {
      console.error("Error saving media:", error);
      Alert.alert(
        "Error",
        `Failed to save ${previewMedia.type}. Please try again.`
      );
    }
  };

  const discardMedia = () => {
    setShowPreview(false);
    setPreviewMedia(null);
  };

  const updateTimer = useCallback(() => {
    setRecordingTime((prevTime) => prevTime + 1);
  }, []);

  const toggleRecording = async () => {
    if (!(await checkPermissions())) {
      return;
    }
    try {
      if (isRecording) {
        await camera.current.stopRecording();
        setIsRecording(false);
        // Stop the timer
        if (timerInterval) {
          clearInterval(timerInterval);
          setTimerInterval(null);
        }
      } else {
        await camera.current.startRecording({
          onRecordingFinished: (video) => {
            setPreviewMedia({ path: video.path, type: "video" });
            setShowPreview(true);
            // Reset the timer
            setRecordingTime(0);
          },
          onRecordingError: (error) => {
            console.error("Recording error:", error);
            Alert.alert("Error", "Failed to record video. Please try again.");
          },
          audio: true,
          videoCodec: "h264",
        });
        setIsRecording(true);
        // Start the timer
        const interval = setInterval(updateTimer, 1000);
        setTimerInterval(interval);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to toggle recording. Please try again.");
    }
  };

  const toggleCamera = () => {
    if (!isSwitchingCamera) {
      setIsSwitchingCamera(true);
      setTimeout(() => {
        setIsFrontCamera((prev) => !prev);
        setIsSwitchingCamera(false);
      }, 350);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const onProgress = (data) => {
    setCurrentTime(data.currentTime);
  };

  const onLoad = (data) => {
    setDuration(data.duration);
  };

  const onEnd = () => {
    if (videoRef.current) {
      videoRef.current.seek(0);
    }
  };

  if (isLoading || isSwitchingCamera) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#445281" />
      </View>
    );
  }

  if (isCameraRestricted) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.Text}>Camera access is restricted by the operating system.
         {' '}<Text style={styles.Text}>
          Please check your device settings or contact your administrator.
          </Text> 
        </Text>
      </View>
    );
  }

  if (!hasCamera) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.Text}>No camera available on this device</Text>
      </View>
    );
  }

  const finalDevice = device || manualDevice;

  if (!finalDevice) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.Text}>Camera is not ready yet</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.SafeContainer}>
      <View style={styles.container}>
        {finalDevice && (
          <Camera
            ref={camera}
            style={styles.CameraCaptureArea}
            device={finalDevice}
            isActive={true}
            photo={true}
            video={true}
            audio={true}
            videoStabilizationMode="auto"
            enableAudioFocus={true}
            onError={() => {
              navigation.navigate("UserSearch");
            }}
          />
        )}
        {isRecording && (
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>
              {Math.floor(recordingTime / 60)
                .toString()
                .padStart(2, "0")}
              :{(recordingTime % 60).toString().padStart(2, "0")}
            </Text>
          </View>
        )}
        <View
          style={styles.CameraSwitch_PhotoCapture_Recording_Button_Container}
        >
         <View style={styles.CameraSwitchButtonContainer}>
          { isRecording ?
            null
           :  <TouchableOpacity
           style={styles.CameraSwitchButton}
           onPress={toggleCamera}
         >
           <Image
             source={CameraFlipButtonIcon}
             style={styles.CameraFlipButtonIcon}
           />
         </TouchableOpacity>
          }
         </View>
          <TouchableOpacity
            style={styles.CameraShutterButton}
            onPress={capturePhoto}
            disabled={isRecording ? true : false }
          >
            <Image
              source={CameraShutterIcon}
              style={styles.CameraShutterIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.VideoRecordingButton}
            onPress={toggleRecording}
          >
            {isRecording ? (
              <Image
                source={videoRecordingOnIcon}
                style={styles.videoRecordingOnIcon}
              />
            ) : (
              <Image
                source={videoRecordingButtonIcon}
                style={styles.videoRecordingButtonIcon}
              />
            )}
          </TouchableOpacity>
        </View>
        <Modal visible={showPreview} transparent={true} animationType="fade">
          <View style={styles.previewContainer}>
            {previewMedia?.type === "photo" ? (
              <View style={styles.CapturedPhotoPreviewContainer}>
                <Image
                  source={{ uri: `file://${previewMedia.path}` }}
                  style={styles.CapturedPhotoPreview}
                />
              </View>
            ) : (
              <View style={styles.videoContainer}>
                <View style={styles.VideoPreviewContainer}>
                  <Video
                    ref={videoRef}
                    source={{ uri: previewMedia?.path }}
                    style={styles.RecordedVideoPreview}
                    paused={!isPlaying}
                    resizeMode="contain"
                    onProgress={onProgress}
                    onLoad={onLoad}
                    onEnd={onEnd}
                    repeat={true}
                  />
                </View>
                <View style={styles.videoControls}>
                  <Text style={styles.durationText}>
                    {Math.floor(currentTime)}s / {Math.floor(duration)}s
                  </Text>
                  <TouchableOpacity
                    style={styles.VideoControlsButton}
                    onPress={togglePlayPause}
                  >
                    {isPlaying ? (
                      <Image
                        source={PauseButtonIcon}
                        style={styles.PauseButtonIcon}
                      />
                    ) : (
                      <Image
                        source={PlayButtonIcon}
                        style={styles.PlayButtonIcon}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}
            <View style={styles.previewButtonContainer}>
              <TouchableOpacity
                style={styles.DiscardPreviewButton}
                onPress={discardMedia}
              >
                <Text style={styles.DiscardText}>Discard</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.SavePreviewButton}
                onPress={handleSaveMedia}
              >
                <Text style={styles.SaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  SafeContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  container: {
    flex: 1,
    height: Dimensions.get("screen").height,
    width: Dimensions.get("screen").width,
    backgroundColor: "black",
    alignItems: "center",
  },
  CameraCaptureArea: {
    height: Dimensions.get("screen").height * 0.8,
    width: Dimensions.get("screen").width,
  },
  CameraSwitch_PhotoCapture_Recording_Button_Container: {
    height: Dimensions.get("screen").height * 0.1,
    width: Dimensions.get("screen").width,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  CameraSwitchButtonContainer:{
    height: 70,
    width: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  CameraSwitchButton: {
    height: 70,
    width: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  CameraFlipButtonIcon: {
    height: 30,
    width: 30,
    tintColor: "white",
  },
  CameraShutterButton: {
    height: 75,
    width: 75,
    tintColor: "white",
  },
  CameraShutterIcon: {
    height: 75,
    width: 75,
  },
  VideoRecordingButton: {
    height: 70,
    width: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  videoRecordingButtonIcon: {
    height: 37,
    width: 37,
    tintColor: "white",
  },
  videoRecordingOnIcon: {
    height: 40,
    width: 40,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,1)",
    justifyContent: "center",
    alignItems: "center",
  },
  Text: {
    fontSize: 15,
    fontFamily: 'Medium'
  },
  previewContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  CapturedPhotoPreviewContainer: {
    width: "90%",
    height: "55%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  CapturedPhotoPreview: {
    width: "90%",
    height: "100%",
    resizeMode: "contain",
  },
  previewButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  DiscardPreviewButton: {
    backgroundColor: "#B83227",
    width: 150,
    height: 50,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  SavePreviewButton: {
    backgroundColor: "#445281",
    width: 150,
    height: 50,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  DiscardText: {
    fontSize: 15,
    fontFamily: "Bold",
    color: "white",
  },
  SaveText: {
    fontSize: 15,
    fontFamily: "Bold",
    color: "white",
  },
  videoContainer: {
    width: "90%",
    height: "60%",
    justifyContent: "center",
    alignItems: "center",
  },
  VideoPreviewContainer: {
    width: "85%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  RecordedVideoPreview: {
    width: "95%",
    height: "95%",
    resizeMode: "contain",
  },
  videoControls: {
    position: "absolute",
    bottom: 15,
    width: "40%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  VideoControlsButton: {
    height: 40,
    width: 40,
    borderRadius: 30,
    marginHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  PauseButtonIcon: {
    height: 15,
    width: 15,
    tintColor: "white",
  },
  PlayButtonIcon: {
    height: 15,
    width: 15,
    tintColor: "white",
  },
  durationText: {
    fontFamily: "Black",
    color: "white",
    textAlign: "center",
  },
  timerContainer: {
    position: "absolute",
    top: 20,
    alignSelf: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 5,
    borderRadius: 5,
  },
  timerText: {
    color: "white",
    fontSize: 18,
    fontFamily: "Bold",
  },
});

export default CameraScreen;
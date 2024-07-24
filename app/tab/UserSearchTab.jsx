import React, { useEffect, useState, useCallback } from "react";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import {
  BackHandler,
  StyleSheet,
  Platform,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  ActivityIndicator,
  FlatList,
  Text,
  Alert,
  Modal
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import {
  addToSearchHistory,
  setSearchHistory,
  clearSearchHistoryItem,
  clearAllSearchHistory,
} from "../reducer/userSearchSlice";
import CameraButtonIcon from "../../assets/Images/GoToCameraButtonIcon.png";
import clearUserSearch from "../../assets/Images/clearUserSearchButtonIcon.png";
import SearchedUserDetailsModal from '../../components/SearchedUserDetailsModal'

// Custom hook for debouncing
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const UserSearchTab = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const searchHistory = useSelector((state) => state.userSearch.searchHistory);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchedText, setSearchedText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const debouncedSearchTerm = useDebounce(searchedText, 300); // 300ms debounce

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (isFocused) {
          BackHandler.exitApp();
          return true;
        }
        return false;
      }
    );
    return () => backHandler.remove();
  }, [isFocused]);

  useEffect(() => {
    loadSearchHistory();
  }, []);

  useEffect(() => {
    if (debouncedSearchTerm.trim() !== "") {
      fetchUserData();
    } else {
      setSearchResults([]);
      setHasSearched(false);
    }
  }, [debouncedSearchTerm]);

  const loadSearchHistory = async () => {
    try {
      const storedHistory = await AsyncStorage.getItem("searchHistory");
      if (storedHistory) {
        dispatch(setSearchHistory(JSON.parse(storedHistory)));
      }
    } catch (error) {
      console.error("Error loading search history:", error);
    }
  };

  const saveSearchHistory = async (newHistory) => {
    try {
      await AsyncStorage.setItem("searchHistory", JSON.stringify(newHistory));
    } catch (error) {
      console.error("Error saving search history:", error);
    }
  };

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      setHasSearched(true);
      
      let searchTerm = debouncedSearchTerm.trim();
      if (searchTerm === "") {
        setSearchResults([]);
        return;
      }
      
      if (searchTerm.startsWith('@')) {
        searchTerm = searchTerm.slice(1);
      }

      const dataURL = `https://dummyjson.com/users/search?q=${encodeURIComponent(searchTerm)}`;
      const dataResponse = await fetch(dataURL);
      const jsonUserData = await dataResponse.json();
      
      setSearchResults(jsonUserData.users);
      
      if (searchTerm) {
        dispatch(addToSearchHistory(searchTerm));
        saveSearchHistory(
          [
            searchTerm,
            ...searchHistory.filter((item) => item !== searchTerm),
          ].slice(0, 5)
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearSearchHistoryItem = useCallback((item) => {
    dispatch(clearSearchHistoryItem(item));
    saveSearchHistory(searchHistory.filter(historyItem => historyItem !== item));
  }, [searchHistory]);

  const handleClearAllSearchHistory = useCallback(() => {
    Alert.alert(
      "Clear All Search History",
      "Are you sure you want to clear all search history?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "OK", 
          onPress: () => {
            dispatch(clearAllSearchHistory());
            saveSearchHistory([]);
          }
        }
      ]
    );
  }, []);

  const handleTextInput = useCallback((searchInput) => {
     if (searchInput.startsWith('@')) {
    setSearchedText(searchInput.trimStart());
  } else {
    setSearchedText(searchInput.trimStart().replace(/^@+/, ''));
  }
  }, []);

  const handleClearUserSearch = useCallback(() => {
    setSearchedText("");
    setSearchResults([]);
    setHasSearched(false);
  }, []);
  
  const renderUserItem = ({ item }) => (
    <View style={styles.userItem}>
      <Pressable onPress={() => {
        setSelectedUser(item);
        setModalVisible(true);
      }}>
        <Text style={styles.userName}>
          {item.firstName} {item.lastName}
        </Text>
        <Text style={styles.userUsername}>@{item.username}</Text>
      </Pressable>
    </View>
  );

  const renderHistoryItem = ({ item }) => (
    <View style={styles.historyItem}>
      <TouchableOpacity onPress={() => setSearchedText(item)} style={styles.historyItemText}>
        <Text style={styles.searchedHistoryText}>{item}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleClearSearchHistoryItem(item)} style={styles.clearHistoryItemButton}>
        <Text style={styles.clearButtonText}>clear</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.SafeContainer}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.KeyboardAvoidingContainer}
      >
        <View style={styles.Container}>
          <View style={styles.UpperContainer}>
            <View style={styles.CameraButtonContainer}>
              <TouchableOpacity
                style={styles.CameraButton}
                onPress={() => navigation.navigate("Camera")}
              >
                <Image
                  source={CameraButtonIcon}
                  style={styles.CameraButtonIcon}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.UserSearchContainer}>
              <View style={styles.SearchField}>
                <TextInput
                  value={searchedText}
                  onChangeText={handleTextInput}
                  placeholder="Search username or name"
                  placeholderTextColor={"grey"}
                  style={styles.TextInputField}
                />
                <View style={styles.UserSearchClearContainer}>
                  {searchedText && (
                    <Pressable
                      style={styles.clearUserSearchButton}
                      onPress={handleClearUserSearch}
                    >
                      <Image
                        source={clearUserSearch}
                        style={styles.clearUserSearch}
                      />
                    </Pressable>
                  )}
                </View>
              </View>
            </View>
          </View>
          {hasSearched ? (
            isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#435182" />
              </View>
            ) : searchResults.length > 0 ? (
              <FlatList
                data={searchResults}
                renderItem={renderUserItem}
                keyExtractor={(item) => item.id.toString()}
                style={styles.resultsList}
              />
            ) : (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>No users found.</Text>
              </View>
            )
          ) : (
            <>
              <View style={styles.historyHeader}>
                {searchHistory.length > 0 && (
                  <>
                    <Text style={styles.historyHeaderText}>Search History</Text>
                    <TouchableOpacity onPress={handleClearAllSearchHistory} style={styles.clearAllButton}>
                      <Text style={styles.clearAllButtonText}>Clear All</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
              <FlatList
                data={searchHistory}
                renderItem={renderHistoryItem}
                keyExtractor={(item) => item}
                style={styles.historyList}
              />
            </>
          )}
        </View>
        <Modal
          animationType="fade"
          visible={modalVisible}
          transparent
          onRequestClose={() => setModalVisible(false)}
        >
          <SearchedUserDetailsModal 
            user={selectedUser} 
            closeModal={() => setModalVisible(false)} 
          />
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default UserSearchTab;

const styles = StyleSheet.create({
  SafeContainer: {
    flex: 1,
    backgroundColor: "#435182",
  },
  Container: {
    backgroundColor: "white",
    flex: 1,
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    alignItems: "center",
  },
  KeyboardAvoidingContainer: {
    flex: 1,
  },
  loadingContainer:{
    flex:1,
    width: Dimensions.get("window").width,
    alignItems:'center',
    justifyContent:'center' 
  },
  UpperContainer: {
    backgroundColor: "#435182",
    height: 160,
    width: Dimensions.get("window").width,
  },
  CameraButtonContainer: {
    height: "50%",
    width: Dimensions.get("window").width,
  },
  CameraButton: {
    height: "100%",
    width: "15%",
    alignItems: "center",
    justifyContent: "center",
  },
  CameraButtonIcon: {
    height: 24,
    width: 24,
    tintColor: "white",
  },
  UserSearchContainer: {
    height: 80,
    width: Dimensions.get("window").width,
    alignItems: "center",
    justifyContent: "center",
  },
  SearchField: {
    backgroundColor: "white",
    width: "92%",
    height: "70%",
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "center",
  },
  TextInputField: {
    width: "75%",
    height: "100%",
    justifyContent: "center",
    fontSize: 15,
    fontFamily: "Regular",
  },
  UserSearchClearContainer: {
    height: "100%",
    width: "15%",
  },
  clearUserSearchButton: {
    height: "100%",
    width: "100%",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  clearUserSearch: {
    height: "30%",
    width: "30%",
    objectFit: "contain",
    tintColor: "grey",
  },
  resultsList: {
    width: "100%",
    paddingHorizontal: 20,
  },
  userItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#DAE0E2",
  },
  userName: {
    fontSize: 15,
    fontFamily:'Bold',
  },
  userUsername: {
    fontSize: 14,
    color: "grey",
    fontFamily:'Regular'
  },
  historyList: {
    width: "100%",
    paddingHorizontal: 20,
  },
  historyHeader: {
    width:'100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  historyHeaderText: {
    fontSize: 20,
    fontFamily:'Black',
  },
  historyItem: {
    width:'100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  historyItemText: {
    flex: 1
  },
  searchedHistoryText:{
    fontSize:15,
    fontFamily:'Regular'
  },
  clearHistoryItemButton: {
    padding: 5,
  },
  clearButtonText: {
    color: 'red',
    fontSize: 15,
    fontFamily:'Medium'
  },
  clearAllButton: {
    padding: 5,
  },
  clearAllButtonText: {
    color: 'red',
    fontSize: 15,
    fontFamily:'Bold'
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
    fontFamily: 'Medium',
    color: 'black',
  },
});
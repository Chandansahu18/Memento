import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';

const SearchedUserDetailsModal = ({ user, closeModal }) => {
  if (!user) return null;
  return (
    <View style={styles.ModalContainer}>
      <View style={styles.wrapperContainer}> 
        <View style={styles.ModalCloseContainer}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={closeModal}
        >
          <Text style={styles.textStyle}>Close</Text>
        </TouchableOpacity>
        </View>
        <View style={styles.ModalContentContainer}>
          <View style={styles.userProfileImageContainer}>
          <Image source={{uri:`${user.image}`}} style={styles.userProfileImage}/>
          </View>
          <View style={styles.userDetailsContainer}>
          <Text style={styles.modalTitle}>{user.firstName} {user.lastName}</Text>
          <Text style={styles.modalText}>Username: <Text style={styles.userDetailsText}>@{user.username}</Text></Text>
          <Text style={styles.modalText}>Gender: <Text style={styles.userDetailsText}>{user.gender}</Text></Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  ModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  wrapperContainer: {
    backgroundColor: "white",
    height: Dimensions.get("window").height*0.5,
    width: Dimensions.get("window").width*0.9,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  ModalContentContainer:{
   height:'80%',
   width:'100%',
   alignItems:'center'
  },
  userProfileImageContainer:{
    height:60,
    width:60,
    marginBottom:20,
    borderRadius:100,
    alignItems:'center',
    justifyContent:'center',
    borderWidth:1,
    borderColor:'#ccc'

  },
  userProfileImage:{
   height:'70%',
   width:'70%',
   objectFit:'contain'
  },
  userDetailsContainer:{
height:'60%',
width:'80%'
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
    fontFamily: 'Bold',
  },
  modalText: {
    marginBottom: 15,
    textAlign: "left",
    fontSize: 15,
    fontFamily: 'Medium',
  },
  userDetailsText:{
    marginBottom: 15,
    fontSize: 15,
    fontFamily: 'Bold',
  },
  ModalCloseContainer:{
     height:'20%',
     width:'100%',
     alignItems:'flex-end',
     justifyContent:'center'
  },
  closeButton: {
    width:'20%',
    height:'100%',
    alignItems:'center',
    justifyContent:'center'
  },
  textStyle: {
    color: "red",
    fontSize:15,
    fontFamily:'Medium',
    textAlign: "center"
  },
});

export default SearchedUserDetailsModal;
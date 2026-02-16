import React, { useEffect, useState, useRef } from 'react'
import { Image, ScrollView, Text, View, Pressable, Alert, FlatList } from 'react-native'
import { StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { TextInput } from 'react-native-paper';
import DatePicker from 'react-native-date-picker'
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import AddDueScreen from "./ProfileScreen/AddDue"
import { useNavigation } from '@react-navigation/native';
import DueDetail from './ProfileScreen/DueDetail';



const Profile = ({ route }) => {
  const userId = route.params.userId;
  const navigation = useNavigation();
  const [dueData, setDueData] = useState({
    dueDate: "",
    amount: 0,
    description: "",
    photo: [],
    completed: false,


  });
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState({});
  const [duesData, setDuesData] = useState([]);
  const [capturedPhoto, setCapturedPhoto] = useState(null);

  const [open, setOpen] = useState(false)
  const [cameraWindow, setCameraWindow] = useState(false)
  const camera = useRef(null)
  const cameraWindowRef = useRef(null)
  const device = useCameraDevice('back')
  const takePhoto = async () => {
    const photo = await camera.current.takePhoto()
    console.log(photo)
    const imagePath = `file://${photo.path}`;

    setCapturedPhoto(imagePath);
    setCameraWindow(false)
    setShowForm(true)


  }
  const uploadImage = async (imageUri) => {
    try {
      const fileName = `dues/${Date.now()}.jpg`; // unique name
      const reference = storage().ref(fileName);

      // remove "file://"
      const uploadUri = imageUri.replace('file://', '');

      await reference.putFile(uploadUri);

      const downloadURL = await reference.getDownloadURL();

      return downloadURL;

    } catch (error) {
      console.log("Upload Error:", error);
      return null;
    }
  };

  const addDue = async () => {
    try {
      let imageUrl = null;

      if (capturedPhoto) {
        imageUrl = await uploadImage(capturedPhoto);
      }

      await firestore().collection(`duesUsers/${userId}/dues`).add({
        ...dueData,
        photo: imageUrl,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      Alert.alert("Success", "Due Added Successfully");

    } catch (error) {
      console.log("Firestore Error:", error);
    }
  };




  const fetchUserDetails = async () => {
    const userDocument = await firestore().collection('duesUsers').doc(userId).get();
    if (userDocument.exists) {
      const realData = userDocument.data();  // 👈 ab ye chalega
      console.log(realData);
      setUser(realData)
    }


  }

  useEffect(() => {
    fetchUserDetails();
  }, [])
  useEffect(() => {
    const checkPermission = async () => {
      await requestCameraPermission();
    };

    checkPermission();
  }, []);

  const fetchDues = async () => {

    const duesCollection = await firestore()
      .collection('duesUsers')
      .doc(userId)
      .collection('dues')
      .get();

    const duesData1 = duesCollection.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log(duesData1)
    setDuesData(duesData1)
  }
  useEffect(() => {
    fetchDues();
  }, [])


  const requestCameraPermission = async () => {
    try {
      const permission = await Camera.getCameraPermissionStatus();

      if (permission === "authorized") {
        return true;
      }

      const newPermission = await Camera.requestCameraPermission();

      if (newPermission === "authorized") {
        return true;
      } else {
        // Alert.alert("Permission Required", "Camera permission is needed");
        return false;
      }

    } catch (error) {
      console.log("Permission Error:", error);
      Alert.alert("Error", "Something went wrong while requesting permission");
      return false;
    }
  };
  return (
    <View style={{ flex: 1 }}>


      <ScrollView style={styles.mainContainer} contentContainerStyle={{ flexGrow: 1 }}>

        <View>

          {user.profile && <Image style={{ height: 200, width: "100%" }} source={{ uri: user.profile }} />}

        </View>

        <View style={[styles.iconContainer, { borderWidth: 1 }]}>
          <Icon name="call" size={30} color="black" />
          <Icon name="message" size={30} color="black" />
          <FontAwesome name="whatsapp" size={30} color="black" />
        </View>
        {/* <View style={{gap:10}}>
          {duesData.length > 0 ? duesData.map((item) => {
            return (
              <Pressable style={{}} onPress={()=>navigation.navigate("DueDetail",{DueDetail:item})}>

              <View style={{backgroundColor:"#dada", gap:10}}>

                <View style={styles.dueCard}>

                  <Text>{item.amount}</Text>
                  <Text>{item.dueDate}</Text>
                </View>
               

              </View>
                    </Pressable>
            )
          }) :
            <View style={{ justifyContent: "center", alignItems: "center", marginTop: 10 }}>
              <Text style={{ fontSize: 20 }}>No Dues </Text>
            </View>

          }
        </View> */}
        <FlatList
          data={duesData} 
         
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 15  }}
          ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
          renderItem={({ item }) => (
            <Pressable
            
              onPress={() =>
                navigation.navigate("DueDetail", { DueDetail: item })
              }
            >
              <View style={styles.dueCardText}>
                <Text>Amount: {item.amount}</Text>
                <Text>Due Date: {item.dueDate}</Text>
              </View>
            </Pressable>
          )}
        />

        <View style={styles.bottomIcons}>
          <Pressable style={styles.addDueButton}
            // onPress={() => setShowForm(true)}
            onPress={() => navigation.navigate("AddDue", { userId })}
          >


            <Icon style={{ textAlign: "center" }} name="add" size={30} color="black" />
          </Pressable>
          {/* <Pressable style={styles.addDueButton} onPress={()=>{addDue()}}>

          <Icon style={{textAlign:"center"}} name="remove" size={30} color="black"/>
        </Pressable> */}

        </View>
      </ScrollView>

      {
        showForm && <AddDueScreen />
      }
      {/* {
        showForm && (
          <Pressable
            style={styles.overlay}
            onPress={() => setShowForm(false)}  // Outside click
          >
            <Pressable
              style={{ height: "100%", width: "100%" }}
              onPress={(e) => e.stopPropagation()} // Prevent close when clicking inside form
            >
              <View style={{ height: "100%", width: "100%" }}>

                {capturedPhoto ? (
                  <Image
                    source={{ uri: capturedPhoto }}
                    style={{
                      height: 300,
                      width: "100%",
                      borderRadius: 15,
                      alignSelf: "center",
                      marginBottom: 10
                    }}
                  />
                ) :



                  <View style={{ height: 200, width: "100%", borderWidth: 1, alignItems: 'center', justifyContent: "center", backgroundColor: "rgba(50, 50, 50, 0.67)" }}>

                    <Pressable onPress={() => { setShowForm(false); setCameraWindow(true) }} style={{}}>
                      <Text>
                        <Icon name="camera-alt" size={200} color="black" />
                      </Text>
                    </Pressable>
                  </View>
                }

                <View style={styles.floatingInputContainer}>
                  <TextInput underlineColor='transparent' style={styles.textInput} keyboardType='numeric' placeholder='Amount' name="amount" value={dueData.amount}
                    onChangeText={(text) => setDueData({ ...dueData, amount: text })} />
                  <TextInput underlineColor='transparent' style={styles.textInput} keyboardType='text' placeholder='Decription' name="description"
                    value={dueData.description}
                    onChangeText={text => setDueData({ ...dueData, description: text })} />
                  <View style={{ flexDirection: "row" }}>

                    <Pressable style={[styles.addDueButton, { flex: 1 }]} onPress={() => setOpen(true)}>
                      <Text style={{ fontSize: 20 }}>  {dueData.dueDate ? dueData.dueDate : "Due Date"}</Text>

                    </Pressable>
                  </View>
                  <DatePicker
                    modal
                    mode='date'
                    open={open}
                    date={new Date()}
                    onConfirm={(date) => {
                      setOpen(false)
                      setDueData({ ...dueData, dueDate: date.toDateString() })
                      console.log(dueData)
                    }}
                    onCancel={() => {
                      setOpen(false)
                    }}
                  />
                  <Pressable onPress={addDue} style={[styles.addDueButton, { width: "100%" }]}>
                    <Text style={{ textAlign: "center", height: 30, fontSize: 23, fontWeight: "semibold" }} >ADD</Text>
                  </Pressable>
                </View>
              </View>

            </Pressable>
          </Pressable>

        )
      }

      {cameraWindow &&
        <View>
          {device && <Camera
            ref={camera}
            photo={true}
            device={device}
            style={{ height: "90%", width: "100%" }}
            isActive={true}
            preview={true}
          />

          }
          <View style={{ justifyContent: "center", alignContent: "center", width: "100%" }}>
            <Pressable onPress={() => takePhoto()}>

              <Icon style={{ transform: [{ translateY: -100 }], textAlign: "center" }} name="camera" size={60} color="red" />
            </Pressable>
          </View>
        </View>
      } */}

    </View>


  )

}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    borderWidth: 1,
    marginBottom: 34,

  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    // color:'black', 
    textAlign: 'center',
    marginTop: 20
  },
  iconContainer: {
    flexDirection: "row",
    padding: 5,
    gap: 30,
    backgroundColor: "rgba(189, 182, 189, 0.67)",
    borderRadius: 10,
    justifyContent: 'center'
  },
  bottomIcons: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 50
  },
  addDueButton: {
    padding: 10,
    backgroundColor: "green",
    width: 80,
    borderRadius: 30,
  },
  floatingInputContainer: {
    // backgroundColor: "white",
    padding: 10,
    // position: "absol ute",
    // top: "50%",
    // left: "50%",
    // transform: [
    //   { translateX: -150 }, // half width
    //   { translateY: -175 }   // half height
    // ],
    width: "100%",
    // height: 150,
    borderRadius: 10,
    // padding: 5,
    gap: 10

  },
  textInput: {
    backgroundColor: "white",
    borderRadius: 20,
    // borderWidth: 1,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    elevation: 10

  }, overlay: {
    width: "100%",
    borderWidth: 1,
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(36, 13, 13, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  dueCard: {
   borderRadius:10
  },
  dueCardText:{
    borderRadius:20,
    backgroundColor:"green",
    padding:10,

  }


})
export default Profile;


import { PageBody } from '../source/layout/Layout';
import { Modal, Portal, Text, Button, PaperProvider } from 'react-native-paper';
import React, { useEffect, useState, useRef } from 'react'
import { Image, ScrollView, View, Pressable, Alert, FlatList } from 'react-native'
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
import useTheme from '../hooks/useTheme';



const Profile = ({ route }) => {
  const [totalCredits, setTotalCredits] = useState(null);
  const [totalDues, setTotalDues] = useState(null);
  const [totalPayable, setTotalPayable] = useState(null);
  const [displayCard, setDisplayCard] = useState("transactions")
  const color = useTheme();
  const userId = route.params.userId;
  const navigation = useNavigation();
  const [dueData, setDueData] = useState({
    dueDate: "",
    amount: 0,
    description: "",
    photo: [],
    completed: false,


  });
  //for rn paper modal
  const [visible, setVisible] = React.useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {  backgroundColor: color.background, padding: 20, marginHorizontal: 20, borderRadius: 12, gap: 6 };

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
  const fetchCredits = async () => {
    const duesCollection = await firestore()
      .collection('duesUsers')
      .doc(userId)
      .collection('credits')
      .get();

    const duesData1 = duesCollection.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    let totalCredits = duesData1.reduce((total, item) => {
      const amount = Number(item.amount);

      if (!isNaN(amount)) {
        return total + amount;
      }

      return total;


    }, 0);

    console.log("toal credits are", totalCredits)

    setTotalCredits(totalCredits)


  }

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

    let totalDues = duesData1.reduce((total, item) => {
      const amount = Number(item.amount);

      if (!isNaN(amount)) {
        return total + amount;
      }

      return total;


    }, 0);

    console.log("toal dues are", totalDues)
    setTotalDues(totalDues)
  }
  useEffect(() => {
    fetchDues();
    fetchCredits();
  }, [])
  useEffect(()=>{
    const system = totalDues-totalCredits
    setTotalPayable(system)
  },[totalCredits,totalDues])


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
    <PageBody>

      <View style={{ flex: 1 }}>




        <ScrollView style={styles.mainContainer} contentContainerStyle={{ flexGrow: 1 }}>

          <View>

            {user.profile && <Image style={{ height: 200, width: "100%" }} source={{ uri: user.profile }} />}

          </View>

          <View style={[styles.iconContainer, { margin: 15, elevation: 1, backgroundColor: color.background }]}>
            <Icon name="call" size={30} color={color.text} />
            <Icon name="message" size={30} color={color.text} />
            <FontAwesome name="whatsapp" size={30} color={color.text} />
          </View>

          <View style={{ flexDirection: "row" }}>

            <Pressable onPress={() => setDisplayCard("transactions")}>
              <Text style={[styles.buttonsContainer, { borderColor: color.borderColor }]}>Transactions</Text>
            </Pressable>

            <Pressable onPress={() => setDisplayCard("overview")}>
              <Text style={[styles.buttonsContainer, { borderColor: color.borderColor }]}>Overview</Text>
            </Pressable>

          </View>
          {displayCard == "transactions" ?

            <FlatList
              data={duesData}

              keyExtractor={(item) => item.id}
              contentContainerStyle={{ padding: 15 }}
              ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
              renderItem={({ item }) => (
                <Pressable

                  onPress={() =>
                    navigation.navigate("DueDetail", { DueDetail: item })
                  }
                >
                  <View style={[{ backgroundColor: color.background, borderColor: color.borderColor, borderWidth: .3 }, styles.dueCardText]}>
                    <View style={{ flexDirection: 'row', gap: 4 }}>
                      <Text style={{ fontWeight: "700", fontSize: 15 }}>
                        Amount:
                      </Text>
                      <Text>
                        {item.amount}
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 4 }}>
                      <Text style={{ fontWeight: "700", fontSize: 15 }}>
                        Due Date:
                      </Text>
                      <Text>
                        {item.dueDate}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              )}
            />
            :
            <View style={[{borderColor:color.borderColor, backgroundColor:color.background},styles.overview]}>
              <View>
                <Text style={[{},styles.payable]}>Total Payable</Text>
                <Text style={[{},styles.count]}>{totalPayable}</Text>
              </View>
              
            </View>
          }


          <View style={styles.bottomIcons}>
            <Pressable style={({ pressed }) => [
              styles.addDueButton,
              pressed && styles.pressed
            ]}
              // onPress={() => setShowForm(true)}
              // onPress={() => navigation.navigate("AddDue", { userId })}
              onPress={() => showModal()}
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








        <Portal >
          <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <Pressable
              onPress={() => { hideModal(); navigation.navigate("AddDue", { userId: userId }); }}
              style={
                ({ pressed }) => (
                  {
                    backgroundColor: color.background,
                    borderColor:color.borderColor,
                    borderWidth:.3,
                    padding: 10,
                    elevation: 1,
                    borderRadius: 12,
                    height: 50,
                    opacity: pressed ? 0.6 : 1

                  }
                )
              }
            >
              <Text style={[{ fontSize: 20, textAlign: "center", color: color.text },]}>Add Due</Text>
            </Pressable >
            <Pressable style={
              ({ pressed }) => (
                {
                  backgroundColor: color.background,
                      borderColor:color.borderColor,
                    borderWidth:.3,
                  padding: 10,
                  elevation: 1,
                  borderRadius: 12,
                  height: 50,
                  opacity: pressed ? 0.6 : 1

                }
              )
            }
              onPress={() => { navigation.navigate("AddCredit", { userId: userId }); hideModal() }}
            >
              <Text style={{ fontSize: 20, textAlign: "center", color: color.text }}>Add Credit</Text>
            </Pressable>
            {/* <Text>Example Modal.  Click outside this area to dismiss.</Text> */}
          </Modal>
        </Portal>



      </View>
    </PageBody>




  )

}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
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
    backgroundColor: "white",
    elevation: 6,
    width: 80,
    borderRadius: 30,
  },
  pressed: {
    opacity: 0.7
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
    borderRadius: 10
  },
  dueCardText: {
    // height:80,
    borderRadius: 20,
    padding: 10,
    paddingVertical: 16,
    elevation: 1

  },
  buttonsContainer: {
    gap: 9,
    padding: 10,
    borderWidth: .3,
    marginHorizontal: 10,
    borderRadius: 20
  },
  overview:{
    margin:10,
    marginTop:15,
    marginStart:8,
    padding:16,
    borderWidth:.3,
    elevation:1,
    gap:5,
    borderRadius:20

  },
  payable:{
    fontWeight:"bold",
    fontSize:16
  },
  count:{
    fontSize:50
  }


})
export default Profile;


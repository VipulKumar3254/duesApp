import functions from '@react-native-firebase/functions';
  import { PageBody } from '../source/layout/Layout';
import { Modal, Portal, Text, Button, PaperProvider } from 'react-native-paper';
import React, { useEffect, useState, useRef } from 'react'
import { Image, ScrollView, View, Pressable, Alert, FlatList, Linking } from 'react-native'
import { StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { TextInput } from 'react-native-paper';
import DatePicker from 'react-native-date-picker'
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
  const containerStyle = { backgroundColor: color.background, padding: 20, marginHorizontal: 20, borderRadius: 12, gap: 6 };

  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState({});
  const [duesData, setDuesData] = useState([]);
  const [capturedPhoto, setCapturedPhoto] = useState(null);

  const [open, setOpen] = useState(false)
  const [cameraWindow, setCameraWindow] = useState(false)
  const camera = useRef(null)
  const cameraWindowRef = useRef(null)
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

  const openWhatsApp = () => {
    const phoneNumber = "+91" + user.phone; // country code + number (no + sign)
    const message = "Hello bro 👋";

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    Linking.openURL(url)
      .catch(() => {
        Alert.alert("Make sure WhatsApp is installed");
      });
  };


  const openMessages = () => {
    const phoneNumber = user.phone;
    const message = "Your due amount is pending.";

    const separator = Platform.OS === 'ios' ? '&' : '?';

    const url = `sms:${phoneNumber}${separator}body=${encodeURIComponent(message)}`;

    Linking.openURL(url).catch((err) => Alert.alert("unable to open Message app"))
  };


  const openPhone = () => {
    const phoneNumber = user.phone;

    Linking.openURL(`tel:${phoneNumber}`)
      .catch(() => {
        Alert.alert("Unable to open dialer");
      });
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
    // setDuesData(duesData1)

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
  const fetchUsersDetails = async () => {
    console.log("gu kha")

      // functions().useEmulator('172.20.10.2', 5001);
    const usersDueDetails = functions().httpsCallable('usersDueDetails');

    let result = await usersDueDetails({ uid: userId });

   result.data.sort((a, b) =>
  b.createdAt._seconds - a.createdAt._seconds
);
    console.log("combined result is ",result.data);

    setDuesData(result.data)


  }

  useEffect(() => {

    fetchUsersDetails();



  }, [])
  useEffect(() => {
    fetchDues();
    fetchCredits();
  }, [])
  useEffect(() => {
    const system = totalDues - totalCredits
    setTotalPayable(system)
  }, [totalCredits, totalDues])


  return (
    <PageBody>

      <View style={{ flex: 1 }}>




        <View style={styles.mainContainer} contentContainerStyle={{ flexGrow: 1 }}>

          <View>

            {user.profile && <Image style={{ height:250, width: "100%", objectFit: "cover" }} source={{ uri: user.profile }} />}

          </View>

          <View style={[styles.iconContainer, { margin: 15, elevation: 1, backgroundColor: color.background }]}>
            <Pressable onPress={() => openPhone()}>

              <Icon name="call" size={30} color={"green"} />
            </Pressable>
            <Pressable onPress={() => openMessages()}>

              <Icon name="message" size={30} color={"green"} />
            </Pressable>
            <Pressable onPress={() => openWhatsApp()}>

              <FontAwesome name="whatsapp" size={30} color={"green"} />
            </Pressable>
          </View>

          <View style={{ flexDirection: "row" }}>

            <Pressable style={[styles.buttonsContainer, { backgroundColor: displayCard == "transactions" ? "#7c7d7c" : color.background , borderColor:color.borderColor}]} onPress={() => setDisplayCard("transactions")}>
              <Text style={[{ borderColor: color.borderColor }]}>Transactions</Text>
            </Pressable>

            <Pressable style={[styles.buttonsContainer, { backgroundColor: displayCard == "overview" ? "#7c7d7c" : color.background, borderColor:color.borderColor }]} onPress={() => setDisplayCard("overview")}>
              <Text style={[{ borderColor: color.borderColor }]}>Overview</Text>
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
                  <View style={[{ backgroundColor: item.type=="credit"?color.creditColor:color.dueColor, borderColor: color.borderColor, borderWidth: .3 }, styles.dueCardText]}>
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
                        {item.type=="due"? "Due":""} Date:
                      </Text>
                      <Text>
                        {item.type=="credit"?item.date:item.dueDate}
                      </Text>
                    </View>

                  </View>
                </Pressable>
              )}
            />
            :
            <View style={{ alignItems: "center", gap: 10,marginTop:10  , marginBottom:10 }}>

              <View style={[{ borderColor: color.borderColor, backgroundColor: color.dueColor }, styles.overview]}>
                <View>
                  <Text style={[{color:color.text}, styles.payable]}>Total Payable</Text>
                  <Text style={[{color:color.text}, styles.count]}>{totalPayable}</Text>
                </View>

              </View>
              <View style={[{ borderColor: color.borderColor, backgroundColor: color.dueColor }, styles.overview]}>
                <View>
                  <Text style={[{color:color.text}, styles.payable]}>Total Dues</Text>
                  <Text style={[{color:color.text}, styles.count]}>{totalDues}</Text>
                </View>

              </View>
              <View style={[{ borderColor: color.borderColor, backgroundColor: color.creditColor }, styles.overview]}>
                <View>
                  <Text style={[{color:color.text}, styles.payable]}>Total Credits</Text>
                  <Text style={[{color:color.text}, styles.count]}>{totalCredits}</Text>
                </View>

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
        </View>

        {
          showForm && <AddDueScreen />
        }








        <Portal >
          <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <Pressable
              onPress={() => { hideModal(); navigation.navigate("AddDue", { user: user , userId:userId}); }}
              style={
                ({ pressed }) => (
                  {
                    backgroundColor: color.background,
                    borderColor: color.borderColor,
                    borderWidth: .3,
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
                  borderColor: color.borderColor,
                  borderWidth: .3,
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
    // position: "absolute",
    marginTop:10,
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
    // marginTop:10,
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
    // elevation: 1

  },
  buttonsContainer: {
    gap: 9,
    padding: 10,
    borderWidth: .3,
    marginHorizontal: 10,
    borderRadius: 20
  },
  overview: {
    width: "95%",

    padding: 16,
    borderWidth: .3,
    // elevation: .3,
    borderWidth:.3,

    borderRadius: 20

  },
  payable: {
    fontWeight: "bold",
    fontSize: 16
  },
  count: {
    fontSize: 50
  }


})
export default Profile;


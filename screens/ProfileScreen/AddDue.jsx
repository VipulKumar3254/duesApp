import React, { useEffect, useState, useRef } from 'react';
import { Alert, TextInput } from 'react-native';
import { Image, Pressable } from 'react-native';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import DatePicker from 'react-native-date-picker';
import Icon from "react-native-vector-icons/MaterialIcons"
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import useTheme from '../../hooks/useTheme';

const AddDue = ({route}) => {
    const color = useTheme();
    const userId= route.params.userId


    const [capturedPhoto, setCapturedPhoto] = useState(null);
    const [open, setOpen] = useState(false);
    const [duesData, setDuesData] = useState([]);
  const [dueData, setDueData] = useState({
  amount: "",
  description: "",
  dueDate: ""
});

    const [cameraWindow, setCameraWindow] = useState(false)
    const device = useCameraDevice('back')

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
    useEffect(() => {
        const checkPermission = async () => {
            await requestCameraPermission();
        };

        checkPermission();
    }, []);


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
        <View>


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

                        <Pressable onPress={() => { setCameraWindow(true) }} style={{}}>
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

                        <Pressable style={[styles.addDueButton, { flex: 1, backgroundColor:color.background }]} onPress={() => setOpen(true)}>
                            <Text style={{ fontSize: 17 }}>  {dueData.dueDate ? dueData.dueDate : "Due Date"}</Text>

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
                    <Pressable onPress={addDue} style={[styles.addDueButton, { width: "100%" , backgroundColor:color.background}]}>
                        <Text style={{ textAlign: "center", height: 30, fontSize: 23,fontWeight: "semibold" }} >ADD</Text>
                    </Pressable>
                </View>
            </View>

            {cameraWindow &&
                <View style={{ position: "absolute", height: "100%", width: "100%" }}>
                    <Pressable
                        onPress={() => setCameraWindow(false)}
                        style={{
                            position: "absolute",
                            top: 30,
                            right: 20,
                            zIndex: 1000,
                            backgroundColor: "rgba(190, 188, 190, 0.67)",
                            borderRadius: 20
                        }}
                    >
                        <Icon name="close" size={40} color="red" />
                    </Pressable>
                    {device && <Camera
                        ref={camera}
                        photo={true}
                        device={device}
                        style={{ height: "100%", width: "100%" }}
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
            }



        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
        height: 50,
        backgroundColor: "white",
        borderRadius: 20,
        // borderWidth: 1,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 1,
        elevation: 1,
        padding:10,
        fontSize:17
    }, overlay: {
        width: "100%",
        borderWidth: 1,
        ...StyleSheet.absoluteFill,
        backgroundColor: "rgba(36, 13, 13, 0.4)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 100,
    },
    addDueButton: {
        padding: 10,
        width: 80,
        borderRadius: 30,
    },
});

export default AddDue;
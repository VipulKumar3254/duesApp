import ImagePicker from "react-native-image-crop-picker";

import React, { useEffect, useState, useRef } from 'react';
import { Alert, TextInput, Linking } from 'react-native';
import { Image, Pressable } from 'react-native';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import DatePicker from 'react-native-date-picker';
import Icon from "react-native-vector-icons/MaterialIcons"
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import useTheme from '../../hooks/useTheme';
import { PageBody } from '../../source/layout/Layout';
import { ActivityIndicator,MD2Colors } from "react-native-paper";

const AddDue = ({ route }) => {
    const color = useTheme();
    const [ShowActivityIndicator, setShowActivityIndicator] = useState(false);
    const {userId ,user}= route.params;



    const [capturedPhoto, setCapturedPhoto] = useState(null);
    const [open, setOpen] = useState(false);
    const [duesData, setDuesData] = useState([]);
    const [dueData, setDueData] = useState({
        amount: "",
        description: "",
        dueDate: ""
    });


    const takePhoto = () => {


        ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: true,
        }).then((image) => {
            setCapturedPhoto(image)

        });
    }
    
    const uploadImage = async () => {
        try {
            const fileName = `duesUsers/dues/${userId}/${Date.now()}.jpg`;

            const reference = storage().ref(fileName);


            await reference.putFile(capturedPhoto.path);

            const downloadURL = await reference.getDownloadURL();

            return downloadURL;

        } catch (error) {
            console.log("Upload Error:", error);
            return null;
        }
    };



    const addDue = async () => {
            setShowActivityIndicator(true)

        if (!dueData.amount || !dueData.description || !dueData.dueDate || !capturedPhoto) {
            Alert.alert("Please fill all the fields.")
            setShowActivityIndicator(false)
            return;
        }
        try {
            let imageUrl = null;

            if (capturedPhoto) {
                imageUrl = await uploadImage(capturedPhoto);
            }

            await firestore().collection(`duesUsers/${userId}/dues`).add({
                ...dueData,
                photo: imageUrl,
                userProfile:user.profile,
                createdAt: firestore.FieldValue.serverTimestamp(),

            });
            await firestore().collection(`globalDues`).add({
                ...dueData,
                photo: imageUrl,
                uid:userId,
                userProfile:user.profile,
                createdAt: firestore.FieldValue.serverTimestamp(),
            });
            setShowActivityIndicator(false)
            Alert.alert("Success", "Due Added Successfully");

        } catch (error) {
            console.log("Firestore Error:", error);
            setShowActivityIndicator(false)
            Alert.alert("Error while adding due, Try again.")
        }
    };


    return (
        <PageBody>

            <View>


                <View style={{ height: "100%", width: "100%" }}>

                    {capturedPhoto ? (
                        <Image
                            source={{ uri: capturedPhoto.path }}
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

                            <Pressable onPress={() => { takePhoto() }} style={{}}>
                                <Text>
                                    <Icon name="camera-alt" size={200} color="black" />
                                </Text>
                            </Pressable>
                        </View>
                    }

                    <View style={[styles.floatingInputContainer, { backgroundColor: color.background }]}>
                        <TextInput underlineColor='transparent' style={[styles.textInput, { backgroundColor: color.background, borderColor: color.borderColor, color: color.text }]} keyboardType='numeric' placeholder='Amount' name="amount" value={dueData.amount}
                            onChangeText={(text) => setDueData({ ...dueData, amount: text })} />
                        <TextInput underlineColor='transparent' style={[styles.textInput, { backgroundColor: color.background, borderColor: color.borderColor, color: color.text }]} keyboardType='text' placeholder='Decription' name="description"
                            value={dueData.description}
                            onChangeText={text => setDueData({ ...dueData, description: text })} />
                        <View style={{ flexDirection: "row", backgroundColor: color.background }}>

                            <Pressable style={[styles.addDueButton, { flex: 1, borderColor: color.borderColor, backgroundColor: color.background }]} onPress={() => setOpen(true)}>
                                <Text style={{ fontSize: 17, color: color.text }}>  {dueData.dueDate ? dueData.dueDate : "Due Date"}</Text>

                            </Pressable>
                        </View>
                        <DatePicker
                            modal
                            mode='date'
                            open={open}
                            date={new Date()}
                            style={{ borderColor: color.borderColor, borderWidth: .3 }}
                            onConfirm={(date) => {
                                setOpen(false)
                                setDueData({ ...dueData, dueDate: date.toDateString() })
                                console.log(dueData)
                            }}
                            onCancel={() => {
                                setOpen(false)
                            }}
                        />
                        <Pressable onPress={addDue} style={[styles.addDueButton, { borderColor: color.borderColor, width: "100%", backgroundColor: color.background }]}>
                            <Text style={{ color: color.text, textAlign: "center", height: 30, fontSize: 23, fontWeight: "semibold" }} >ADD</Text>
                        </Pressable>
                    </View>
                </View>



            </View>

                 {
                ShowActivityIndicator && (
                    <View style={styles.overlay}>
                        <ActivityIndicator
                            size="large"
                            animating={true}
                            color={MD2Colors.grey500}
                        />
                    </View>
                )
            }
        </PageBody>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    floatingInputContainer: {
        padding: 10,
        width: "100%",
        borderRadius: 10,
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
        padding: 10,
        fontSize: 17,
        borderWidth: .3,
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
        borderWidth: .3
    },
});

export default AddDue;
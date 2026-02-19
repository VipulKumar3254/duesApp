import { ActivityIndicator, MD2Colors } from 'react-native-paper';
import { Alert, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { PageBody } from '../../source/layout/Layout';
import useTheme from '../../hooks/useTheme';
import { TextInput } from 'react-native-paper';
import Icon from "react-native-vector-icons/MaterialIcons"

import DatePicker from 'react-native-date-picker';
import ImageCropPicker from 'react-native-image-crop-picker';
import ImagePicker from "react-native-image-crop-picker";


const AddCredit = ({ route }) => {

    
    const [capturedPhoto, setCapturedPhoto] = useState(null);
    const [ShowActivityIndicator, setShowActivityIndicator] = useState(false);
    const [creditData, setCreditData] = useState({
        amount: "",
        description: "",
        date: ""
    });
    const [open, setOpen] = useState(false);
    const color = useTheme();
    const userId = route.params.userId;
    console.log(userId)

    const takePhoto = () => {


        ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: true,
        }).then((image) => {
            setCapturedPhoto(image)

        });
    }

    const AddCreditToFirebase = async () => {
        setShowActivityIndicator(true)
        try {
            if (!creditData.amount || !creditData.description || !creditData.date) {
                setShowActivityIndicator(false);
                Alert.alert("Please fill all fields");
                return;
            }

            let imageUrl = null;

            // ✅ Upload Image if available
            if (capturedPhoto) {
                const fileName = `credits/${userId}/${Date.now()}.jpg`;

                const reference = storage().ref(fileName);

                await reference.putFile(capturedPhoto.path);

                imageUrl = await reference.getDownloadURL();
            }

            // ✅ Save to Firestore
            await firestore()
                .collection("duesUsers")
                .doc(userId)
                .collection("credits")
                .add({
                    amount: Number(creditData.amount),
                    description: creditData.description,
                    date: creditData.date,
                    image: imageUrl,
                    createdAt: firestore.FieldValue.serverTimestamp(),
                });
            setShowActivityIndicator(false)
            Alert.alert("Credit Added Successfully ");

            // Reset form
            setCreditData({
                amount: "",
                description: "",
                date: "",
            });

            setCapturedPhoto(null);

        } catch (error) {
            console.log(error);
            setShowActivityIndicator(false)

            Alert.alert("Error adding credit");
        }
    };


    return (
        <PageBody scrollable>



            <View style={{ height: "100%", width: "100%" }}>

                {capturedPhoto ? (
                    <Image
                        source={{ uri: capturedPhoto?.path }}
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

                <View style={styles.floatingInputContainer}>
                    <TextInput underlineColor='transparent' style={[styles.textInput,{backgroundColor:color.background, color:color.text,    borderWidth:.3,
                                borderColor:color.borderColor,
                            }]} keyboardType='numeric' placeholder='Amount' name="amount" value={creditData.amount}
                        onChangeText={(text) => setCreditData({ ...creditData, amount: text })} />
                    <TextInput underlineColor='transparent' style={[styles.textInput,{backgroundColor:color.background, color:color.text,    borderWidth:.3,
                                borderColor:color.borderColor,}]} keyboardType='text' placeholder='Decription' name="description"
                        value={creditData.description}
                        onChangeText={text => setCreditData({ ...creditData, description: text })} />
                    <View style={{ flexDirection: "row" }}>

                        <Pressable style={[styles.addDueButton, {
                            flex: 1,
                            elevation:1,
                            backgroundColor: color.background,
                                borderWidth:.3,
                                borderColor:color.borderColor,

                        }]} onPress={() => setOpen(true)}>
                            <Text style={{ fontSize: 20 , backgroundColor:color.background,color:color.text}}>  {creditData.date ? creditData.date : "Date"}</Text>

                        </Pressable>
                    </View>
                    <DatePicker
                        modal
                        mode='date'
                        open={open}
                        date={new Date()}
                        onConfirm={(date) => {
                            setOpen(false)
                            setCreditData({ ...creditData, date: date.toDateString() })
                            console.log(creditData)
                        }}
                        onCancel={() => {
                            setOpen(false)
                        }}
                    />
                    <Pressable
                        disabled={ShowActivityIndicator}
                        onPress={AddCreditToFirebase}
                        style={(pressed) => [
                            styles.addDueButton,
                            {
                                width: "100%",
                                backgroundColor: color.background,
                                borderWidth:.3,
                                borderColor:color.borderColor,

                                elevation: 1,
                                opacity: ShowActivityIndicator ? 0.6 : 1
                            }
                        ]}
                    >
                        <Text style={{ textAlign: "center", height: 30, fontSize: 23, fontWeight: "semibold", color:color.text }} >ADD</Text>
                    </Pressable>
                </View>
            </View>


            {
                ShowActivityIndicator && (
                    <View style={styles.overlay}>
                        <ActivityIndicator
                            size="large"
                            animating={true}
                            color={MD2Colors.red800}
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
    input: {
        borderWidth: 1,
        // borderColor: color.card

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
        borderRadius: 20,
        // borderWidth: 1,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        elevation: 1

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
    ActivityIndicator:
    {
        backgroundColor: "rgba(255,255,255,0.2)"
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
    },
});

export default AddCredit;

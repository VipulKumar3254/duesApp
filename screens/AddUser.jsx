import storage from '@react-native-firebase/storage';
import ImagePicker from "react-native-image-crop-picker";
import { useSelector } from 'react-redux';
import React from 'react';
import { View, Vibration, Text, StyleSheet, ScrollView, Alert, Pressable } from 'react-native';
import { ActivityIndicator, TextInput, MD2Colors, overlay } from 'react-native-paper';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { useState, useEffect, useRef } from 'react';
import useTheme from "../hooks/useTheme"
import firestore from '@react-native-firebase/firestore';
import { Animated } from "react-native";
import ThemedInput from "../source/common/atom/ThemedInput";

const AddUser = () => {
    const [activityIndicator, setShowActivityIndicator] = useState(false);
    const [capturedPhoto, setCapturedPhoto] = useState(null);
    const [userData, setUserData] = useState({});
    const scale = useRef(new Animated.Value(1)).current;
    const color = useTheme();


    const handlePressIn = () => {
        Animated.spring(scale, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };



    const takePhoto = async () => {
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: true,
        }).then((image) => {
            setCapturedPhoto(image)

        }).catch((err) => {
            console.log("eror while uplaod file", err``)
        })


    };

    const handleSubmit = async (data) => {
        setShowActivityIndicator(true);


        if (!userData.name || !userData.phone || !userData.address || !capturedPhoto) {
            setShowActivityIndicator(false);
            Alert.alert("Please fill all fields");
            return;
        }
        try {
            let imageUrl;

            if (capturedPhoto) {
                const fileName = `duesUsers/userPhotos/${Date.now()}.jpg`;

                const reference = storage().ref(fileName);

                await reference.putFile(capturedPhoto.path);

                imageUrl = await reference.getDownloadURL();
            }
            firestore()
                .collection('duesUsers')
                .add({
                    ...data,
                    profile: imageUrl,
                })
                .then(() => {
                    console.log('User added!');
                    setShowActivityIndicator(false);

                    Alert.alert("User Added");
                }).catch((err) => {
                    setShowActivityIndicator(false);

                    Alert.alert("Error while adding User");
                    console.log(err)
                })




        }
        catch (err) {
            console.log(err)
            setShowActivityIndicator(false);

        }

    }


    return (
        <ScrollView style={{ backgroundColor: color.background }}>
            {/* <Camera
      ref={camera}
    //   {...cameraProps}
    device={device}
    style={{ width: '100%', height: 300 }}
    isActive={true}
      photo={true}
    /> */}
            <View style={[styles.center(color), styles.iconWrapper]}>
                <Pressable onPress={() => { takePhoto() }}>

                    <Icons style={styles.iconWrapper} name="account-circle" size={200} color="black" />
                </Pressable>
            </View>
            <View style={styles.container}>
                <ThemedInput style={[{color:color.text},styles.inputBox]}
                    theme={color}
                    placeholder="Name"
                    keyboardType="text"
                    value={userData.name}
                    onChangeText={text => setUserData({ ...userData, name: text })}
                />
                <ThemedInput style={[{color:color.text},styles.inputBox]}
                    focusLineColor='transparent'
                    label="Phone"
                    theme={color}
                    placeholder="Phone"
                    underlineColor='transparent'
                    value={userData.phone}
                    onChangeText={text => setUserData({ ...userData, phone: text })}
                    textContentType='telephoneNumber'
                    keyboardType='numeric'
                // underlineColor='transparent' removes the underline of textinput
                // keyboardType='phone-pad'   this also works but different layout.

                // onChangeText={text => setText(text)}
                />
                <ThemedInput style={[styles.inputBox, styles.addressInput, {color:color.text}]}
                    label="Address"
                    placeholder="Address"
                    theme={color}
                    value={userData.address}
                    onChangeText={text => setUserData({ ...userData, address: text })}
                    textContentType='addressCity'
                    keyboardType='text'
                    underlineColor='transparent'
                    multiline
                    numberOfLines={4}

                // keyboardType='phone-pad'   this also works but different layout.

                // onChangeText={text => setText(text)}
                />
                <View style={styles.iconWrapper1}>
                    <Pressable
                        android_ripple={{ color: "rgba(0,0,0,0.2)" }}
                        onPressIn={handlePressIn}

                        onPressOut={handlePressOut}
                        style={{
                            backgroundColor: color.background, borderWidth: 1,
                            borderColor: "#999", elevation: 1, alignItems: 'center', borderRadius: 10,
                        }}
                        onPress={() => {
                            Vibration.vibrate(1000); // 200ms vibration
                            handleSubmit(userData)
                        }}>
                        <Text style={[{ color: color.text, fontSize: 20, fontWeight: 'medium', padding: 10, },]}>Add User</Text>
                    </Pressable>
                </View>
            </View>
            {
                activityIndicator &&

                <View style={styles.overlay}>

                    <ActivityIndicator size={"large"} animating={true} color={MD2Colors.grey500} />
                </View>
            }
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    center: color => ({
        flex: 1,

        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "rgb(97, 97, 101)"
    }),
    addressInput: {
        height: 130,
    },
    inputBox: {
        fontSize: 20,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#999",

        borderRadius: 18,
        borderTopRightRadius: 18,
        borderTopLeftRadius: 18,
        focusLineColor: 'transparent',
        // backgroundColor: "#fff",
        // shadowColor: "#000000",
        // shadowOffset: { width: 0, height: 10 },
        // shadowOpacity: 1,
        elevation: 1
    },
    iconWrapper1: {
        // backgroundColor:"pink",
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 1,
        elevation: 10,
    },
    iconWrapper: {
        shadowColor: "#000000",
        shadowOffset: { width: 10, height: 10 },
        shadowOpacity: 1,
        shadowRadius: 15,
        elevation: 10,
        // borderRadius: 50,
    },
    overlay: {
        width: "100%",
        ...StyleSheet.absoluteFill,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
    }

});

export default AddUser;
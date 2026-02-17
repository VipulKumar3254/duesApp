import { useSelector } from 'react-redux';
import React from 'react';
import { View,Vibration, Text, StyleSheet, ScrollView, Alert, Pressable } from 'react-native';
import { TextInput } from 'react-native-paper';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { useState, useEffect, useRef } from 'react';
import { useCameraDevice, Camera, useCameraPermission } from 'react-native-vision-camera';
import firestore from '@react-native-firebase/firestore';
import { Animated } from "react-native";

const AddUser = () => {
    const [userData, setUserData] = useState({});
    const scale = useRef(new Animated.Value(1)).current;
    const theme= useSelector((state)=>state.theme.theme)
    console.log(theme);
    
    



    const device = useCameraDevice("back");
    console.log(device)
    const { hasPermission } = useCameraPermission()


    if (!hasPermission) return "no permission granted to access camera";
    if (device == null) return "no camera found";




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

    useEffect(() => {
        (async () => {
            const permission = await Camera.requestCameraPermission()
            console.log(permission)
        })()
    }, [])
    const camera = useRef(null);

    const takePhoto = async () => {
        try {
            const photo = await camera.current.takePhoto({
                flash: 'off', // on | off | auto
            });

            console.log("Photo path:", photo.path);
        } catch (error) {
            console.log("Capture Error:", error);
        }
    };

    const handleSubmit = (data) => {

        firestore()
            .collection('duesUsers')
            .add({
                ...data,
                profile:"data:image/jpeg;base64,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"
            })
            .then(() => {
                console.log('User added!');
                Alert.alert("User Added");
            }).catch((err) => {
                Alert.alert("Error while adding User");
                console.log(err)
            })
    }

    if (device == null) return "loading";
    return (
        <ScrollView>
            {/* <Camera
      ref={camera}
    //   {...cameraProps}
    device={device}
    style={{ width: '100%', height: 300 }}
    isActive={true}
      photo={true}
    /> */}
            <View style={[styles.center, styles.iconWrapper]}>
                <Pressable onPress={() => { takePhoto() }}>

                    <Icons style={styles.iconWrapper} name="account-circle" size={200} color="black" />
                </Pressable>
            </View>
            <View style={styles.container}>
                <TextInput style={styles.inputBox}
                    underlineColor='transparent'
                    label="Name"
                    value={userData.name}
                    onChangeText={text => setUserData({ ...userData, name: text })}
                />
                <TextInput style={styles.inputBox}
                    focusLineColor='transparent'
                    label="Phone"
                    underlineColor='transparent'
                    value={userData.phone}
                    onChangeText={text => setUserData({ ...userData, phone: text })}
                    textContentType='telephoneNumber'
                    keyboardType='numeric'
                // underlineColor='transparent' removes the underline of textinput
                // keyboardType='phone-pad'   this also works but different layout.

                // onChangeText={text => setText(text)}
                />
                <TextInput style={[styles.inputBox, styles.addressInput]}
                    label="Address"
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
                        style={{ backgroundColor: 'green', alignItems: 'center', borderRadius: 10, }}
                        onPress={() => {   Vibration.vibrate(1000); // 200ms vibration
                        handleSubmit(userData) }}>
                        <Text style={[{ fontSize: 20, fontWeight: 'medium', padding: 10, },]}>Add User</Text>
                    </Pressable>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "rgb(97, 97, 101)"
    },
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
        backgroundColor: "#fff",
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 1,
        elevation: 10
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


});

export default AddUser;
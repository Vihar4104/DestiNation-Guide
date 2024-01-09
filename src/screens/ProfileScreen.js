import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { signOut } from 'firebase/auth'
import { useNavigation, useRoute } from '@react-navigation/native'
import { auth } from '../../config/firebase';

const ProfileScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    
    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigation.navigate("Login");
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <View style="flex-1">

            <Image
                className='w-[170px] h-[170px] mt-[100px] ml-[90px]'
                source={require('../../assets/images/avatar.png')} // Replace with the source of your profile picture
            />

            <Text>User's Id: 001</Text>
            <Text>User's Name: Kathan Patel</Text>
            <Text>User's Email: kathanpatel403@gmail.com</Text>


            <TouchableOpacity
                onPress={handleLogout}
                className="py-2 px-4 mt-[400px] ml-[50px] mr-[50px] bg-gray-400 rounded-xl">
                <Text
                    className="text-xl font-bold text-center text-black"
                >
                    Logout
                </Text>
            </TouchableOpacity>

        </View>
    );
};

export default ProfileScreen;

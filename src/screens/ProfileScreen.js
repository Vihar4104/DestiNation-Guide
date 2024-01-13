import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../../config/firebase";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { ChevronLeftIcon } from "react-native-heroicons/solid";

const ProfileScreen = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await signOut(auth).then(() => console.log("Successfully logged out!"));
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <View style="flex-1">
    <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                    padding: wp(4),
                    marginLeft: wp(2),
                    marginRight: wp(82),
                    backgroundColor: 'white',
                    borderRadius: wp(5),
                    marginTop: wp(10)
                }}
            >
                <ChevronLeftIcon size={wp(7)} strokeWidth={4} color="black" />
            </TouchableOpacity>
      <Image
        className="w-[170px] h-[170px] mt-[100px] ml-[90px]"
        source={require("../../assets/images/avatar.png")} // Replace with the source of your profile picture
      />
      
      <View>
        <Text>User's Name: </Text>
        <Text>User's Email:</Text>
      </View>

      <TouchableOpacity
        onPress={handleLogout}
        className="py-2 px-4 mt-[300px] ml-[50px] mr-[50px] bg-gray-400 rounded-xl"
      >
        <Text className="text-xl font-bold text-center text-black">Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;

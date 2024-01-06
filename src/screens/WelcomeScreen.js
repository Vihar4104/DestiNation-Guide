import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import FloatingLogo from '../components/floatingLogo'; // Assuming you have a FloatingLogo component
import TypingEffect from '../components/TypingEffect'; // Assuming the correct path

const WelcomeScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.navigate('Home');
    }, 3000);

    return () => clearTimeout(timeout);
  }, [navigation]);

  // Use useFocusEffect to navigate to Home after 3 seconds when the screen comes into focus
  useFocusEffect(() => {
    const timeout = setTimeout(() => {
      navigation.navigate('Home');
    }, 3000);

    return () => clearTimeout(timeout);
  });

  const onFinishTyping = () => {
    // Logic to handle typing effect completion
  
  };

  return (
    <View className="flex-1 flex justify-end">
      {/* background image */}
      <Image
        source={require('../../assets/images/welcome.png')}
        className="h-full w-full absolute p-3"
      />

      {/* content & gradient */}
      <View className="p-5 pb-10 space-y-8">
        <LinearGradient
          colors={['transparent', 'rgba(156, 230, 255,0.6)']}
          style={{ width: wp(100), height: hp(50) }}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          className="absolute bottom-0"
        />
        <View className="space-y-3">
          <Text className="mb-96 ml-20">
            <FloatingLogo  />
          </Text>
          <TypingEffect className="w-4"
           
            text="DestiNation Guide"
         
            onFinishTyping={onFinishTyping}
            style={{ fontSize: 24 }}
          />
          <Text className="text-black bottom-16 font-medium mb-28" style={{ fontSize: wp(5) }}>
            Secrets of Gujarat - Your Preferences, Your Journey!
          </Text>
        </View>
      </View>
    </View>
  );
};

export default WelcomeScreen;

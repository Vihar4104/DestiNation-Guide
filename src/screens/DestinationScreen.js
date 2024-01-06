import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Animated, Easing, StatusBar, SafeAreaView } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeftIcon, HeartIcon } from 'react-native-heroicons/solid';
import { theme } from '../theme';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPinIcon } from 'react-native-heroicons/solid';
import LocationSection from '../components/LocationSection.js';

const ios = Platform.OS == 'ios';

const AnimatedText = Animatable.createAnimatableComponent(Text);

export default function DestinationScreen(props) {
  const item = props.route.params;
  const navigation = useNavigation();
  const [isFavourite, toggleFavourite] = useState(false);

  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.bgLight }}>
      {/* destination image */}
      <Animatable.Image
        animation="fadeIn"
        source={item.image}
        style={{ width: wp(100), height: hp(40), borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}
      />
      <StatusBar style="light" />

      {/* back button */}
      <SafeAreaView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', position: 'absolute', marginTop: ios ? 0 : hp(2) }}>
      <TouchableOpacity
                onPress={()=> navigation.goBack()}
                className="p-2 rounded-full ml-4"
                style={{backgroundColor: 'rgba(255,255,255,0.5)'}}
            >
                <ChevronLeftIcon size={wp(7)} strokeWidth={4} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={()=> toggleFavourite(!isFavourite)}
                className="p-2 rounded-full mr-4"
                style={{backgroundColor: 'rgba(255,255,255,0.5)'}}
            >
                <HeartIcon size={wp(7)} strokeWidth={4} color={isFavourite? "red": "white"} />
            </TouchableOpacity>
      </SafeAreaView>

      {/* title & description & booking button */}
      <View style={{borderTopLeftRadius: 40, borderTopRightRadius: 40}} className="px-5 flex flex-1 justify-between bg-white pt-8 -mt-14">
        <ScrollView showsVerticalScrollIndicator={false} style={{ padding: wp(5), paddingTop: hp(0.1) }}>
          <Animatable.View animation="fadeInUpBig">
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <AnimatedText animation="fadeIn" style={{ fontSize: wp(7), fontWeight: 'bold', color: theme.textLight }}>
                {item?.title}
              </AnimatedText>
              <AnimatedText animation="fadeIn" style={{ fontSize: wp(7), color: theme.textLight, fontWeight: 'bold' }}>
                $ {item?.price}
              </AnimatedText>
            </View>
          </Animatable.View>

          <Animatable.View animation="fadeInUpBig" delay={200}>
            <AnimatedText style={{ fontSize: wp(3.7), color: theme.textLight, marginTop: hp(0.1) }}>{item?.shortDescription}</AnimatedText>
          </Animatable.View>

          {/* Location Section */}
          <Animatable.View animation="fadeInUpBig" delay={200} style={{ backgroundColor: theme.bgLocation, borderRadius: wp(3), padding: wp(4), marginTop: hp(3) }}>
        <Text style={{ fontSize: wp(5), fontWeight: 'bold', color: theme.textLight }}>Location</Text>
        <Text style={{ fontSize: wp(4), color: theme.textLight }}>
          {item?.location?.city}, {item?.location?.state}, {item?.location?.country}
        </Text>
      </Animatable.View>
          {/* Activities Section */}
          <Animatable.View animation="fadeInUpBig" delay={600} style={{ backgroundColor: theme.bgSection, borderRadius: wp(3), padding: wp(4), marginTop: hp(0.1) }}>
            <Text style={{ fontSize: wp(5), fontWeight: 'bold', color: theme.textLight }}>Activities</Text>
            {item?.activities?.map((activity, index) => (
              <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <FontAwesome name="circle" size={wp(4)} color={theme.textLight} style={{ marginRight: wp(2) }} />
                <Text style={{ fontSize: wp(4), color: theme.textLight }}>{activity}</Text>
              </View>
            ))}
          </Animatable.View>

          {/* Amenities Section */}
          <Animatable.View animation="fadeInUpBig" delay={800} style={{ backgroundColor: theme.bgSection, borderRadius: wp(3), padding: wp(4), marginTop: hp(0.1) }}>
            <Text style={{ fontSize: wp(5), fontWeight: 'bold', color: theme.textLight }}>Amenities</Text>
            {item?.amenities?.map((amenity, index) => (
              <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <FontAwesome name="circle" size={wp(4)} color={theme.textLight} style={{ marginRight: wp(2) }} />
                <Text style={{ fontSize: wp(4), color: theme.textLight }}>{amenity}</Text>
              </View>
            ))}
          </Animatable.View>

          {/* Reviews Section */}
          <Animatable.View animation="fadeInUpBig" delay={1000} style={{ backgroundColor: theme.bgSection, borderRadius: wp(3), padding: wp(4), marginTop: hp(0.1) }}>
            <Text style={{ fontSize: wp(5), fontWeight: 'bold', color: theme.textLight }}>Reviews</Text>
            {item?.reviews?.map((review, index) => (
              <View key={index} style={{ marginBottom: hp(2) }}>
                <Text style={{ fontSize: wp(4), color: theme.textLight, fontWeight: 'bold' }}>{review.user}</Text>
                <Text style={{ fontSize: wp(3.5), color: theme.textLight }}>{review.comment}</Text>
              </View>
            ))}
          </Animatable.View>

          {/* Booking Button */}
          <Animatable.View animation="fadeInUpBig" delay={1200} style={{ marginTop: hp(0.1) }}>
            <TouchableOpacity style={{ backgroundColor: theme.bg(0.8), height: wp(15), width: '50%', alignSelf: 'center', justifyContent: 'center', alignItems: 'center', borderRadius: wp(10) }}>
              <Text style={{ fontSize: wp(5.5), fontWeight: 'bold', color: 'white' }}>Book now</Text>
            </TouchableOpacity>
          </Animatable.View>
        </ScrollView>
      </View>
    </View>
  );

}

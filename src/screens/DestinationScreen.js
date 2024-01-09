import React, { useState, useEffect, useRef } from "react";
import {
  View,
  ImageBackground,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
  StatusBar,
  SafeAreaView,
  FlatList,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import * as Animatable from "react-native-animatable";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import { ChevronLeftIcon, HeartIcon } from "react-native-heroicons/solid";
import { theme } from "../theme";
import { styled } from "nativewind";

const ios = Platform.OS == "ios";

const AnimatedText = Animatable.createAnimatableComponent(Text);

export default function DestinationScreen(props) {
  const item = props.route.params;

  const navigation = useNavigation();
  const [isFavourite, toggleFavourite] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    require("../../assets/images/kakariya1.jpg"),
    require("../../assets/images/kakariya2.jpg"),
    require("../../assets/images/kakariya3.jpg"),
  ]; // Add your image sources here
  const fadeAnim = new Animated.Value(0);
  const flatListRef = useRef();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / wp(100));
    setCurrentIndex(newIndex);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % images.length;
      flatListRef.current.scrollToIndex({ animated: true, index: nextIndex });
    }, 1500);

    return () => clearInterval(interval);
  }, [currentIndex, images]);

  return (
    <ImageBackground
      source={require("../../assets/images/home3.jpg")} // Change the path to your image
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <FlatList
            style={{
              width: wp(88),
              margin: 20,

              borderRadius: 40,
            }}
            ref={flatListRef}
            data={images}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: fadeAnim } } }],
              {
                useNativeDriver: false,
                listener: handleScroll,
              }
            )}
            renderItem={({ item }) => (
              <Animated.Image
                animation="fadeIn"
                source={item}
                style={{
                  resizeMode: "cover",
                  marginTop: 10,
                  width: wp(85),
                  height: hp(40),
                  marginBottom: -200,
                  overflow: "hidden",

                  borderRadius: 30,

                  margin: 10,
                }}
              />
            )}
          />

          <StatusBar style="light" />

          <SafeAreaView
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              position: "absolute",
              marginTop: ios ? 0 : hp(2),
              paddingHorizontal: wp(2),
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                padding: wp(4),
                marginLeft: wp(2),
                backgroundColor: theme.bgDark,
                borderRadius: wp(5),
              }}
            >
              <ChevronLeftIcon size={wp(7)} strokeWidth={4} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => toggleFavourite(!isFavourite)}
              style={{
                padding: wp(6),
                marginRight: wp(2),
                backgroundColor: theme.bgDark,
                borderRadius: wp(5),
              }}
            >
              <HeartIcon
                size={wp(7)}
                strokeWidth={4}
                color={isFavourite ? "red" : "white"}
              />
            </TouchableOpacity>
          </SafeAreaView>
        </View>
        <View
          style={{
            // marginTop: -200,
            flex: 1,
          }}
        >
          <Animatable.View
            animation="fadeInUpBig"
            style={{
              backgroundColor: theme.bgGrey,
              // borderRadius: wp(3),
              paddingLeft: 100,
              marginTop: -40,
              marginBottom: hp(3),
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <AnimatedText
                animation="fadeIn"
                style={{
                  fontSize: wp(7),
                  fontWeight: "bold",
                  color: theme.textDark,
                }}
              >
                {item?.title}
              </AnimatedText>
            </View>
          </Animatable.View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ padding: wp(5), paddingBottom: hp(1) }}
          >
            <Animatable.View
              animation="fadeInUpBig"
              delay={200}
              style={{
                backgroundColor: "#e3e3e3", // Adjust background color as needed
                borderRadius: wp(5), // Slightly increased border radius
                padding: wp(4),
                marginBottom: hp(3),
                shadowColor: "#fff",
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8, // For Android shadow
                borderWidth: 1, // Border width
                borderColor: "#ccc",
                // Border color
              }}
            >
              <LinearGradient
                colors={["#e6e6e6", "#e3e3e3"]} // Adjust gradient colors as needed
                style={{
                  flex: 1,
                  borderRadius: wp(6), // Slightly increased border radius
                  padding: wp(4),

                  alignItems: "center",
                }}
              >
                <AnimatedText
                  style={{
                    fontSize: wp(3.7),
                    color: theme.textDark,
                    marginTop: hp(0.1),
                    textAlign: "justify",
                    lineHeight: hp(2.5),
                    letterSpacing: 0.5,
                  }}
                >
                  {item?.longDescription}
                </AnimatedText>
              </LinearGradient>
            </Animatable.View>

            <Animatable.View
              animation="fadeInUpBig"
              delay={200}
              style={{
                backgroundColor: "#e3e3e3",
                borderRadius: wp(3),
                padding: wp(4),
                marginBottom: hp(3),
                flexDirection: "row", // Use a flex container to align text and icon horizontally
                alignItems: "center",
                backgroundColor: "#e3e3e3", // Adjust background color as needed
                borderRadius: wp(5), // Slightly increased border radius
                padding: wp(4),
                marginBottom: hp(3),
                shadowColor: "#fff",
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8, // For Android shadow
                borderWidth: 1, // Border width
                borderColor: "#ccc", // Align items vertically in the flex container
              }}
            >
              {/* Location Icon or Image */}
              <Image
                source={require("../../assets/images/ho.png")} // Replace with the actual path to your location icon/image
                style={{
                  width: wp(15), // Adjust the width of the image/icon as needed
                  height: wp(12), // Adjust the height of the image/icon as needed
                  marginRight: wp(1),
                  marginLeft: -10,
                  marginBottom: -15, // Adjust the margin between icon/image and text
                }}
              />

              {/* Text Content */}
              <View>
                <Text
                  style={{
                    fontSize: wp(5),
                    fontWeight: "bold",
                    color: theme.textDark,
                  }}
                >
                  Location
                </Text>
                <Text
                  style={{
                    fontSize: wp(3.7),
                    color: theme.textDark,
                    marginTop: hp(0.1),
                    textAlign: "justify",
                    lineHeight: hp(2.5),
                    letterSpacing: 0.5,
                  }}
                >
                  {item?.location?.city}, {item?.location?.state},{" "}
                  {item?.location?.country}
                </Text>
              </View>
            </Animatable.View>

            {/* Activities Section */}
            <Animatable.View
              animation="fadeInUpBig"
              delay={600}
              style={{
                backgroundColor: "#D3d3d3",
                marginBottom: hp(3),
                borderRadius: wp(3),
                padding: wp(4),
                marginTop: hp(0.1),
              }}
            >
              <Text
                style={{
                  fontSize: wp(5),
                  fontWeight: "bold",
                  color: theme.textLight,
                }}
              >
                Activities
              </Text>
              {item?.activities?.map((activity, index) => (
                <View
                  key={index}
                  style={{ flexDirection: "row", alignItems: "center" }}
                >
                  <FontAwesome
                    name="circle"
                    size={wp(4)}
                    color={theme.textLight}
                    style={{ marginRight: wp(2) }}
                  />
                  <Text style={{ fontSize: wp(4), color: theme.textLight }}>
                    {activity}
                  </Text>
                </View>
              ))}
            </Animatable.View>

            {/* Amenities Section */}
            <Animatable.View
              animation="fadeInUpBig"
              delay={800}
              style={{
                backgroundColor: "#D3d3d3",
                marginBottom: hp(3),
                borderRadius: wp(3),
                padding: wp(4),
                marginTop: hp(0.1),
              }}
            >
              <Text
                style={{
                  fontSize: wp(5),
                  fontWeight: "bold",
                  color: theme.textLight,
                }}
              >
                Amenities
              </Text>
              {item?.amenities?.map((amenity, index) => (
                <View
                  key={index}
                  style={{ flexDirection: "row", alignItems: "center" }}
                >
                  <FontAwesome
                    name="circle"
                    size={wp(4)}
                    color={theme.textLight}
                    style={{ marginRight: wp(2) }}
                  />
                  <Text style={{ fontSize: wp(4), color: theme.textLight }}>
                    {amenity}
                  </Text>
                </View>
              ))}
            </Animatable.View>

            {/* Reviews Section */}
            <Animatable.View
              animation="fadeInUpBig"
              delay={1000}
              style={{
                backgroundColor: "#D3d3d3",
                marginBottom: hp(3),
                borderRadius: wp(3),
                padding: wp(4),
                marginTop: hp(0.1),
              }}
            >
              <Text
                style={{
                  fontSize: wp(5),
                  fontWeight: "bold",
                  color: theme.textLight,
                }}
              >
                Reviews
              </Text>
              {item?.reviews?.map((review, index) => (
                <View key={index} style={{ marginBottom: hp(2) }}>
                  <Text
                    style={{
                      fontSize: wp(4),
                      color: theme.textLight,
                      fontWeight: "bold",
                    }}
                  >
                    {review.user}
                  </Text>
                  <Text style={{ fontSize: wp(3.5), color: theme.textLight }}>
                    {review.comment}
                  </Text>
                </View>
              ))}
            </Animatable.View>
            <Animatable.View
              animation="fadeInUpBig"
              delay={1200}
              style={{ marginTop: hp(0.1) }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: theme.bg(0.8),
                  height: wp(15),
                  width: "50%",
                  alignSelf: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: wp(10),
                  marginBottom: 30,
                }}
              >
                <Text
                  style={{
                    fontSize: wp(5.5),
                    fontWeight: "bold",
                    color: "white",
                  }}
                >
                  Book now
                </Text>
              </TouchableOpacity>
            </Animatable.View>
          </ScrollView>
        </View>
      </View>
    </ImageBackground>
  );
}

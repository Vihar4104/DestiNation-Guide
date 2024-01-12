import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { sortCategoryData } from "../constants";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function SortCategories() {
  const [activeSort, setActiveSort] = useState("Popular");

  return (
    <View className="flex-row justify-around items-center mx-4 bg-neutral-100 rounded-full p-2 px-4 space-x-2" style={{ borderWidth: 1, borderColor: "#dbdbdb" }}>
      {sortCategoryData.map((sort, index) => {
        const isActive = sort === activeSort;

        return (
          <TouchableOpacity
            onPress={() => setActiveSort(sort)}
            key={index}
            style={{
              backgroundColor: isActive ? "#d1d5db" : "",
              borderRadius: 999,
              paddingVertical: 10,
              paddingHorizontal: 20,
              shadowColor: isActive ? "#000000" : "#00000000",
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: isActive ? 5 : 0,
            }}
          >
            <Text
              style={{
                fontSize: wp(4),
                fontWeight: "600",
                color: isActive ? "#000000" : "#000000",
              }}
            >
              {sort}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
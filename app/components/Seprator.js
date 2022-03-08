import { View } from "react-native";
import React from "react";

const Seprator = ({
  width = "100%",
  height = 1,
  backgroundColor = "#d3d3d3",
  style,
}) => {
  return (
    <View
      style={[{ width, height, backgroundColor, alignSelf: "center" }, style]}
    />
  );
};

export default Seprator;

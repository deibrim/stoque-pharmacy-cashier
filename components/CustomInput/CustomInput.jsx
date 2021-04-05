import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { View, TextInput } from "react-native";
import { styles } from "./styles";

const CustomInput = ({
  icon,
  cStyle,
  iStyle,
  placeholder,
  value,
  autoCapitalize,
  keyType,
  editable,
  onChange,
  otherIcon,
}) => {
  return (
    <View style={{ ...styles.inputGroup, ...cStyle }}>
      {icon}

      <TextInput
        style={{ ...styles.input, ...iStyle }}
        underlineColorAndroid="transparent"
        placeholder={placeholder}
        placeholderTextColor="#97989A"
        onChangeText={onChange}
        autoCapitalize={autoCapitalize || "none"}
        keyboardType={keyType || "default"}
        editable={editable}
        value={value}
      />
      {otherIcon}
    </View>
  );
};

export default CustomInput;

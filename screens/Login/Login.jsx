import { AntDesign, Feather, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";
import React, { useState } from "react";
import {
  ImageBackground,
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import { useDispatch } from "react-redux";
import AppButton from "../../components/AppButton/AppButton";
import CustomPopUp from "../../components/CustomPopUp/CustomPopUp";
import { cxlxrs } from "../../constants/Colors";
import { auth, firestore } from "../../firebase/config";
import { setCurrentUser } from "../../redux/user/actions";
import { validateLoginUser } from "../../utils/validations";

import { styles } from "./styles";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [shopId, setShopId] = useState();
  const [passcode, setPasscode] = useState();
  const [toggleShowPassword, setToggleShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const handleSubmit = async () => {
    setErrorMessage("");
    if (phone === "" || passcode === "" || shopId === "") {
      setErrorMessage("All fields are required");
      return;
    }
    setLoading(true);
    onLogUserIn();
  };
  const onLogUserIn = async () => {
    try {
      const cashierRef = firestore
        .collection(`cashiers`)
        .doc(`${shopId}`)
        .collection(`cashiers`);
      cashierRef
        .where("passcode", "==", passcode)
        .where("phone", "==", `${phone}`)
        .onSnapshot((snapShot) => {
          if (snapShot.empty) {
            setErrorMessage("Incorrect credentials");
            return;
          }
          dispatch(setCurrentUser(snapShot.docs[0].data()));
        });
      setLoading(false);
    } catch (error) {
      setErrorMessage("An error occured");
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/auth-bg.png")}
      style={styles.bgStyle}
    >
      <View style={styles.container}>
        <View style={styles.head}>
          <Text style={styles.headText}>Welcome Back</Text>
          <Text style={styles.headSubText}>Login to access your account</Text>
        </View>
        <View style={{ width: "100%", alignItems: "center" }}>
          {errorMessage !== "" ? (
            <CustomPopUp
              message={`${errorMessage}`}
              type={"error"}
              customStyles={{
                backgroundColor: "red",
                borderRadius: 30,
                justifyContent: "center",
              }}
              customTextStyles={{ color: "#ffffff" }}
            />
          ) : null}
        </View>
        <View style={styles.inputGroup}>
          <Feather
            name="grid"
            style={styles.inputGroupIcon}
            size={19}
            color="#97989A"
          />

          <TextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            keyboardType="numeric"
            placeholder="Shop Code"
            placeholderTextColor="#97989A"
            onChangeText={(e) => {
              setErrorMessage("");
              setShopId(e * 1);
            }}
            value={shopId}
          />
        </View>
        <View style={styles.inputGroup}>
          <Feather
            name="phone"
            style={styles.inputGroupIcon}
            size={19}
            color="#97989A"
          />

          <TextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            keyboardType="numeric"
            placeholder="Phone"
            placeholderTextColor="#97989A"
            onChangeText={(e) => {
              setErrorMessage("");
              setPhone(e);
            }}
            value={phone}
          />
        </View>
        <View style={styles.inputGroup}>
          <AntDesign
            name="lock"
            style={styles.inputGroupIcon}
            size={20}
            color="#97989A"
          />
          <TextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            keyboardType="numeric"
            secureTextEntry={!toggleShowPassword ? true : false}
            placeholder="Passcode"
            placeholderTextColor="#97989A"
            onChangeText={(e) => {
              setErrorMessage("");
              setPasscode(e * 1);
            }}
            value={passcode}
          />
          <TouchableWithoutFeedback
            onPress={() => setToggleShowPassword(!toggleShowPassword)}
          >
            <Feather
              name={toggleShowPassword ? "eye-off" : "eye"}
              size={20}
              color="black"
              style={{ marginRight: 10 }}
            />
          </TouchableWithoutFeedback>
        </View>
        <View style={{ marginVertical: 15 }}>
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.navigate("Reset");
            }}
          >
            <Text style={{ textAlign: "center", color: cxlxrs.textColor }}>
              Forgot password?
            </Text>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.btns}>
          <AppButton
            onPress={handleSubmit}
            title="Login"
            customStyle={styles.btn}
            loading={loading}
            textStyle={{
              fontFamily: "FiraCode-Regular",
              textTransform: "capitalize",
              fontWeight: "400",
              marginTop: -3,
            }}
          />
        </View>
      </View>
      <View style={{ position: "absolute", bottom: 20, width: "100%" }}>
        <Text style={{ textAlign: "center", color: cxlxrs.black }}>
          Dont't have an account?{" "}
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.navigate("Register");
            }}
          >
            <Text style={{ color: cxlxrs.textColor }}>Register</Text>
          </TouchableWithoutFeedback>
        </Text>
      </View>
    </ImageBackground>
  );
};

export default Login;

import React, { useEffect, useState } from "react";
import { Dimensions, View } from "react-native";
import { useSelector } from "react-redux";
import { styles } from "./styles";
import { cxlxrs } from "../../constants/Colors";
import AppButton from "../AppButton/AppButton";
import AddProductInput from "../AddProductInput/AddProductInput";
const Charge = ({
  amount,
  setBalance,
  setAmount,
  setCharged,
  setDialogVisible,
  bill,
}) => {
  const user = useSelector(({ user }) => user.currentUser);

  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {}, [""]);
  const onCharge = () => {
    if (amount === "") {
      setErrorMessage("Enter an amount!");
      return;
    }
    const balance = amount - bill;
    setBalance(balance * 1);
    setCharged(true);
    setDialogVisible(false);
  };
  return (
    <View
      style={{
        width: "100%",
        height: Dimensions.get("screen").height,
        backgroundColor: cxlxrs.white,
        flex: 1,
        paddingVertical: 10,
      }}
    >
      <View style={[styles.flexGrouping, { marginBottom: "auto" }]}>
        <AddProductInput
          label="Amount Recived"
          value={amount}
          onChangeText={(e) => {
            setErrorMessage("");
            setAmount(e * 1);
          }}
          keyType="numeric"
          autoFocus
          containerStyle={{
            width: "65%",
          }}
        />
        <AppButton
          onPress={() => {
            onCharge();
          }}
          title="Charge"
          customStyle={styles.addBtn}
          textStyle={styles.addBtnText}
        />
      </View>
    </View>
  );
};

export default Charge;

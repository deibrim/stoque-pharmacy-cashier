import { Feather, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";
import React, { useCallback, useEffect, useState } from "react";
import { View, Image, Text, TouchableOpacity, ScrollView } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useSelector } from "react-redux";
import AppButton from "../../components/AppButton/AppButton";
import { cxlxrs } from "../../constants/Colors";
import { firestore } from "../../firebase/config";

import { styles } from "./styles";

const Transactions = () => {
  const user = useSelector(({ user }) => user.currentUser);
  const navigation = useNavigation();
  const [latestSales, setLatestSales] = useState([]);
  const [isLatestSaleLoading, setIsLatestSaleLoading] = useState(true);
  const [hasData, setHasData] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [reportViewVisible, setReportViewVisible] = useState(false);

  const latestSalesRef = firestore
    .collection("sales")
    .doc(user.id)
    .collection("sales")
    .where("cashier_id", "==", `${user.id}`);

  const fetchData = useCallback(
    async (timeString) => {
      latestSalesRef
        .where("day_created", "==", `${timeString}`)
        .onSnapshot((snapShot) => {
          const salesArr = [];
          if (!snapShot.empty) {
            const docs = snapShot.docs;
            docs.forEach((item, index) => {
              salesArr.push(item.data());
              const arrLength = docs.length - 1;
              if (index === arrLength) {
                setLatestSales(salesArr);
                setIsLatestSaleLoading(false);
              }
            });
            setIsLatestSaleLoading(false);
          }
        });
    },
    [latestSales]
  );
  useEffect(() => {
    const timeString = new Date(Date.now()).toISOString().substring(0, 10);
    fetchData(timeString);
  }, [""]);
  const toggleDatePicker = () => {
    setDatePickerVisibility(!isDatePickerVisible);
  };
  const handleConfirmDate = (date) => {
    const timeString = new Date(date).toISOString().substring(0, 10);
    console.log(timeString);
    setDatePickerVisibility(!isDatePickerVisible);
    fetchData(timeString);
  };

  return (
    <>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <View
              style={{ flexDirection: "row", alignItems: "center", width: 60 }}
            >
              <Ionicons
                name="chevron-back-outline"
                size={24}
                color={cxlxrs.black}
              />
            </View>
          </TouchableOpacity>
        </View>
        <Text style={styles.routeTitle}>Transactions</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.contentContainer}
        style={styles.container}
      ></ScrollView>

      <View style={{ ...styles.buttonContainer }}>
        <AppButton
          onPress={toggleDatePicker}
          title={"Pick a date"}
          customStyle={styles.dateSelector}
          textStyle={styles.dateSelectorText}
        />
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={(date) => handleConfirmDate(date)}
          onCancel={toggleDatePicker}
          isDarkModeEnabled={false}
          pickerContainerStyleIOS={{ backgroundColor: cxlxrs.black }}
        />
      </View>
    </>
  );
};

export default Transactions;

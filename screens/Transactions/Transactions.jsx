import { Feather, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  View,
  RefreshControl,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useSelector } from "react-redux";
import AppButton from "../../components/AppButton/AppButton";
import TransactionPreview from "../../components/TransactionPreview/TransactionPreview";
import { cxlxrs } from "../../constants/Colors";
import { firestore } from "../../firebase/config";

import { styles } from "./styles";

const Transactions = () => {
  let onEndReachedCalledDuringMomentum = false;
  const timeString = new Date(Date.now()).toISOString().substring(0, 10);
  const user = useSelector(({ user }) => user.currentUser);
  const navigation = useNavigation();
  const [latestSales, setLatestSales] = useState([]);
  const [isTranctionsLoading, setIsTransactions] = useState(true);
  const [hasData, setHasData] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const latestSalesRef = firestore
    .collection("sales")
    .doc(user.ownerId)
    .collection("sales")
    .where("cashier_id", "==", `${user.id}`);

  const onRefresh = () => {
    setTimeout(() => {
      fetchTransactions();
    }, 1000);
  };
  const fetchTransactions = async (timeString) => {
    setIsLoading(true);
    await latestSalesRef
      .where("day_created", "==", `${timeString}`)
      .onSnapshot((snapShot) => {
        if (!snapShot.empty) {
          setHasData(true);
          let newProducts = [];

          setLastDoc(snapShot.docs[snapShot.docs.length - 1]);

          for (let i = 0; i < snapShot.docs.length; i++) {
            newProducts.push(snapShot.docs[i].data());
          }

          setTransactions(newProducts);
        } else {
          setLastDoc(null);
        }
      });
    setIsLoading(false);
  };
  useEffect(() => {
    fetchTransactions(timeString);
  }, [""]);
  const toggleDatePicker = () => {
    setDatePickerVisibility(!isDatePickerVisible);
  };
  const handleConfirmDate = (date) => {
    const timeString = new Date(date).toISOString().substring(0, 10);
    setDatePickerVisibility(!isDatePickerVisible);
    navigation.navigate("TransactionView", { timeString });
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

      {isLoading ? (
        <ActivityIndicator
          size="large"
          color={cxlxrs.black}
          style={{ marginBottom: 10 }}
        />
      ) : hasData ? (
        <SafeAreaView style={{ flex: 1, alignItems: "center" }}>
          <View style={styles.listContainer}>
            <FlatList
              data={transactions}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item, index }) => (
                <>
                  <TransactionPreview key={index} data={item} />
                  {index === 2 ? <View style={{ height: 20 }}></View> : null}
                </>
              )}
              ListFooterComponent={
                <RenderFooter isMoreLoading={isMoreLoading} />
              }
              refreshControl={
                <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
              }
              contentContainerStyle={{
                flexGrow: 1,
              }}
              style={{ paddingBottom: 20 }}
              initialNumToRender={10}
              onEndReachedThreshold={0.1}
              onMomentumScrollBegin={() => {
                onEndReachedCalledDuringMomentum = false;
              }}
            />
          </View>
        </SafeAreaView>
      ) : (
        <View style={styles.noData}>
          <Text style={[styles.noDataText, styles.noProductText]}>
            You haven't perform any transaction today.
          </Text>
          <AppButton
            onPress={() => navigation.navigate("MakeSale")}
            title="Make Sale"
            customStyle={{
              backgroundColor: cxlxrs.black,
              borderRadius: 30,
              height: 35,
              width: "40%",
            }}
            textStyle={{
              fontFamily: "FiraCode-Regular",
              textTransform: "capitalize",
              fontWeight: "400",
              fontSize: 12,
              color: cxlxrs.white,
            }}
          />
        </View>
      )}

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
function RenderFooter({ isMoreLoading }) {
  if (!isMoreLoading) return true;

  return (
    <ActivityIndicator
      size="large"
      color={cxlxrs.black}
      style={{ marginBottom: 10 }}
    />
  );
}
export default Transactions;

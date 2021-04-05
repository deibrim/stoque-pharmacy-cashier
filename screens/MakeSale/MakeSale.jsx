import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";
import React, { useCallback, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import AddProductInput from "../../components/AddProductInput/AddProductInput";
import AppButton from "../../components/AppButton/AppButton";
import CustomPopUp from "../../components/CustomPopUp/CustomPopUp";
import { cxlxrs } from "../../constants/Colors";
import { v4 as uuidv4 } from "uuid";
import { styles } from "./styles";
import { useSelector } from "react-redux";
import { Icons } from "../../constants/icons";
import Scanner from "../../components/Scanner/Scanner";

const MakeSale = () => {
  const user = useSelector(({ user }) => user.currentUser);
  const navigation = useNavigation();
  const [cashierName, setCashierName] = useState("");
  const [scannerVisible, setScannerVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {}, []);

  return (
    <>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <View
              style={{ flexDirection: "row", alignItems: "center", width: 90 }}
            >
              <Ionicons name="chevron-back-outline" size={24} color="black" />
            </View>
          </TouchableOpacity>
        </View>
        <Text style={styles.routeTitle}>Make Sale</Text>
      </View>
      <Scanner
        scannerVisible={scannerVisible}
        setScannerVisible={setScannerVisible}
      />
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        style={styles.container}
      >
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
        <View style={styles.table}>
          <View style={[styles.tableHead]}>
            <View style={[styles.tableRow]}>
              <Text
                style={[
                  styles.tableText,
                  styles.tableTextLong,
                  styles.tableHeadText,
                  styles.tableHeadTextName,
                ]}
              >
                Item
              </Text>
              <Text style={[styles.tableText, styles.tableHeadText]}>
                Quantity
              </Text>
              <Text style={[styles.tableText, styles.tableHeadText]}>
                Price
              </Text>
            </View>
          </View>
          <View style={{ height: 20 }}></View>
          <View style={[styles.tableBody]}>
            <View style={[styles.tableRow]}>
              <Text
                style={[
                  styles.tableText,
                  styles.tableTextLong,
                  styles.tableBodyText,
                  styles.tableBodyTextName,
                ]}
              >
                Maltina
              </Text>
              <Text style={[styles.tableText, styles.tableBodyText]}>
                150 x 2
              </Text>
              <Text style={[styles.tableText, styles.tableBodyText]}>₦300</Text>
            </View>
          </View>
          <View style={{ height: 10 }}></View>

          <View style={[styles.tableFooter]}>
            <View style={[styles.tableRow]}>
              <Text
                style={[
                  styles.tableText,
                  styles.tableTextLong,
                  styles.tableFooterText,
                  styles.tableFooterTextName,
                ]}
              >
                Total
              </Text>
              <Text style={[styles.tableText, styles.tableFooterText]}>
                {2}
              </Text>
              <Text
                style={[styles.tableText, styles.tableFooterText]}
              >{`₦${300}`}</Text>
            </View>
          </View>
        </View>
        <View style={styles.bottomButtonsContainer}>
          <View style={styles.bottomButtons}>
            <AppButton
              onPress={() => {}}
              title="Checkout"
              customStyle={{
                ...styles.addBtn,
                width: "70%",
              }}
              textStyle={styles.addBtnText}
            />
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => setScannerVisible(true)}
            >
              <Image
                source={Icons.scan}
                resizeMode="contain"
                style={{
                  width: 20,
                  height: 20,
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.iconContainer, { backgroundColor: cxlxrs.black }]}
              onPress={() => {}}
            >
              <Ionicons name="search" size={20} color={cxlxrs.white} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default MakeSale;

import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import AppButton from "../../components/AppButton/AppButton";
import CustomPopUp from "../../components/CustomPopUp/CustomPopUp";
import { cxlxrs } from "../../constants/Colors";
// import { v4 as uuidv4 } from "uuid";
import { styles } from "./styles";
import { useSelector } from "react-redux";
import { Icons } from "../../constants/icons";
import Scanner from "../../components/Scanner/Scanner";
import SearchProduct from "../../components/SearchProduct/SearchProduct";
import HelperDialog from "../../components/HelperDialog/HelperDialog";
import Charge from "../../components/Charge/Charge";
import { CreateSale } from "../../firebase/firestore";

const MakeSale = () => {
  const user = useSelector(({ user }) => user.currentUser);
  const navigation = useNavigation();
  const [scannerVisible, setScannerVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [charged, setCharged] = useState(false);
  const [amount, setAmount] = useState("0");
  const [balance, setBalance] = useState("0");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [basket, setBasket] = useState([]);
  const [total, setTotal] = useState({ quantity: 0, price: 0 });
  const [type, setType] = useState("");
  const [payMethod, setPayMethod] = useState("");
  const [cash, setCash] = useState(false);
  const onCalculateTotal = () => {
    let qty = 0;
    let totalPrice = 0;
    basket.forEach((item) => {
      qty += item.quantity;
      totalPrice += item.total;
    });
    setTotal({ quantity: qty, price: totalPrice });
  };
  const onCheckout = () => {
    const dateString = new Date().toISOString().substring(0, 10);
    setLoading(true);
    const timestamp = Date.now();
    const saleData = {
      id: timestamp,
      ...total,
      products: basket,
      created_at: timestamp,
      day_created: dateString,
      cashier_id: user.id,
      cashier_name: user.name,
      paymentMethod: payMethod,
    };
    if (cash) {
      saleData["amountRecived"] = amount;
      saleData["balance"] = balance;
    }
    CreateSale(saleData, user.ownerId, cleanUp, navigation);
  };
  function cleanUp() {
    setLoading(false);
    setBasket([]);
    setCharged(false);
    setAmount("0");
    setBalance("0");
    setTotal({ quantity: 0, price: 0 });
    setCash(false);
  }
  useEffect(() => {
    onCalculateTotal();
  }, [basket]);
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
        basket={basket}
        setBasket={setBasket}
      />
      <SearchProduct
        searchVisible={searchVisible}
        setSearchVisible={setSearchVisible}
        basket={basket}
        setBasket={setBasket}
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
          <View style={[styles.tableBody]}>
            {basket.map((item, index) => (
              <View key={index} style={[styles.tableRow]}>
                <Text
                  style={[
                    styles.tableText,
                    styles.tableTextLong,
                    styles.tableBodyText,
                    styles.tableBodyTextName,
                  ]}
                >
                  {item.product_name || "Maltina"}
                </Text>
                <Text style={[styles.tableText, styles.tableBodyText]}>
                  ₦{item.price} x {item.quantity}
                </Text>
                <Text style={[styles.tableText, styles.tableBodyText]}>
                  ₦{item.total}
                </Text>
              </View>
            ))}
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
                {total.quantity} {total.quantity > 1 ? "products" : "product"}
              </Text>
              <Text
                style={[styles.tableText, styles.tableFooterText]}
              >{`₦${total.price}`}</Text>
            </View>
          </View>
          <View style={[styles.tableFooter, styles.tableSubFooter]}>
            <View style={[styles.tableRow]}>
              <Text
                style={[
                  styles.tableText,
                  styles.tableTextLong,
                  styles.tableFooterText,
                  styles.tableFooterTextName,
                ]}
              >
                Amount Recived
              </Text>
              <Text style={[styles.tableText, styles.tableFooterText]}></Text>
              <Text
                style={[styles.tableText, styles.tableFooterText]}
              >{`₦${amount}`}</Text>
            </View>
          </View>
          <View style={[styles.tableFooter, styles.tableSubFooter]}>
            <View style={[styles.tableRow]}>
              <Text
                style={[
                  styles.tableText,
                  styles.tableTextLong,
                  styles.tableFooterText,
                  styles.tableFooterTextName,
                ]}
              >
                Balance
              </Text>
              <Text style={[styles.tableText, styles.tableFooterText]}></Text>
              <Text
                style={[styles.tableText, styles.tableFooterText]}
              >{`₦${balance}`}</Text>
            </View>
          </View>
        </View>
        <View style={styles.bottomButtonsContainer}>
          <View style={styles.bottomButtons}>
            {!basket.length ? null : loading ? (
              <ActivityIndicator
                size="large"
                color={cxlxrs.black}
                style={{ marginBottom: 10 }}
              />
            ) : (
              <AppButton
                onPress={
                  charged
                    ? onCheckout
                    : () => {
                        setType("payMethod");
                        setDialogVisible(true);
                      }
                }
                title={charged ? "Checkout" : "Charge"}
                customStyle={{
                  ...styles.addBtn,
                  width: charged ? "100%" : "70%",
                  backgroundColor: charged ? cxlxrs.black : cxlxrs.white,
                }}
                textStyle={{
                  ...styles.addBtnText,
                  color: charged ? cxlxrs.white : cxlxrs.black,
                }}
              />
            )}
            {!charged || !loading ? (
              <TouchableOpacity
                style={[
                  styles.iconContainer,
                  !basket.length && { marginRight: 10 },
                ]}
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
            ) : null}
            {!charged || !loading ? (
              <TouchableOpacity
                style={[
                  styles.iconContainer,
                  { backgroundColor: cxlxrs.black },
                ]}
                onPress={() => setSearchVisible(true)}
              >
                <Ionicons name="search" size={20} color={cxlxrs.white} />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </ScrollView>
      <HelperDialog
        title={`₦${charged ? balance : total.price}`}
        visible={dialogVisible}
        setDialogVisible={setDialogVisible}
      >
        {type === "charge" && (
          <Charge
            setCharged={setCharged}
            bill={total.price}
            amount={amount}
            setAmount={setAmount}
            balance={balance}
            setBalance={setBalance}
            setDialogVisible={setDialogVisible}
            setPayMethod={setPayMethod}
          />
        )}
        {type === "payMethod" && (
          <>
            <TouchableOpacity
              style={[styles.modalTextButton]}
              onPress={() => {
                setCash(true);
                setType("charge");
              }}
            >
              <Ionicons
                name="md-cash-outline"
                size={20}
                color="black"
                style={{ marginRight: 20 }}
              />
              <Text style={[styles.modalText]}>Cash</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalTextButton]}
              onPress={() => {
                setPayMethod("pos");
                setCharged(true);
                setDialogVisible(false);
              }}
            >
              <AntDesign
                name="creditcard"
                size={20}
                color="black"
                style={{ marginRight: 20 }}
              />
              <Text style={[styles.modalText]}>POS</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalTextButton]}
              onPress={() => {
                setPayMethod("transfer");
                setCharged(true);
                setDialogVisible(false);
              }}
            >
              <MaterialCommunityIcons
                name="transfer"
                size={24}
                color="black"
                style={{ marginRight: 20 }}
              />
              <Text style={[styles.modalText]}>Direct Transfer</Text>
            </TouchableOpacity>
          </>
        )}
      </HelperDialog>
    </>
  );
};

export default MakeSale;

import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { throttle } from "lodash";
import BarCodeScreen from "../CodeScanner/CodeScanner";
import requestCameraPermissionsAsync from "../../utils/requestCameraPermissionsAsync";
import { firestore } from "../../firebase/config";
import { styles } from "./styles";
import { cxlxrs } from "../../constants/Colors";
import AppButton from "../AppButton/AppButton";
import { Ionicons } from "@expo/vector-icons";
import CustomInput from "../CustomInput/CustomInput";
import CustomPopUp from "../CustomPopUp/CustomPopUp";
import { FontFamily } from "../../constants/Fonts";
const Scanner = ({ scannerVisible, setScannerVisible, basket, setBasket }) => {
  const user = useSelector(({ user }) => user.currentUser);
  const [hasPermission, setHasPermission] = useState(null);
  const [quantity, setQuantity] = useState();
  const [scanning, setScanning] = useState(true);
  const [scanned, setScanned] = useState(false);
  const [barcode, setBarcode] = useState("");
  const [noData, setNoData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [productData, setProductData] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    requestPermission();
  }, [""]);
  const getProductData = async (barcode) => {
    setErrorMessage("");
    const productsRef = firestore
      .collection("products")
      .doc(user.ownerId)
      .collection("products")
      .where("barcode", "==", barcode);
    const snapshot = await productsRef.get();
    if (snapshot.empty) {
      setNoData(true);
      setIsLoading(false);
    }
    if (snapshot.docs.length === 1) {
      snapshot.docs.forEach((item) => {
        setProductData(item.data());
      });
      setScanned(true);
      setIsLoading(false);
    }
  };
  const requestPermission = async () => {
    setHasPermission(await requestCameraPermissionsAsync());
  };
  const _handleBarCodeScanned = throttle((info) => {
    setErrorMessage("");
    setNoData(false);
    setScanned(true);
    setScanning(false);
    setIsLoading(true);
    getProductData(info.data);
    setBarcode(info.data);
  }, 1000);

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <Modal
      animationType="fade"
      transparent={false}
      statusBarTranslucent={true}
      visible={scannerVisible}
      onRequestClose={() => {}}
      style={{
        width: "100%",
        height: Dimensions.get("screen").height,
      }}
    >
      <TouchableOpacity
        style={[
          {
            position: "absolute",
            top: 20,
            right: 10,
            backgroundColor: cxlxrs.white,
            zIndex: 10,
            height: 40,
            width: 40,
            borderRadius: 30,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
        onPress={() => setScannerVisible(false)}
      >
        <Ionicons name="close" size={20} color={cxlxrs.danger} />
      </TouchableOpacity>
      <BarCodeScreen
        scanned={scanned}
        setScanned={setScanned}
        setScanning={setScanning}
        handleBarCodeScanned={_handleBarCodeScanned}
      />
      {DetailsViewer(
        scanning,
        barcode,
        noData,
        isLoading,
        productData,
        quantity,
        setQuantity,
        errorMessage,
        setErrorMessage,
        basket,
        setBasket,
        setScanned,
        setIsLoading
      )}
    </Modal>
  );
};

export default Scanner;

function DetailsViewer(
  scanning,
  barcode,
  noData,
  isLoading,
  productData,
  quantity,
  setQuantity,
  errorMessage,
  setErrorMessage,
  basket,
  setBasket,
  setScanned,
  setIsLoading
) {
  const addToBasket = () => {
    // Add to basket
    const data = {
      barcode: productData.barcode,
      product_name: productData.product_name,
      quantity,
      id: productData.id,
      price: productData.price,
      total: productData.price * quantity,
      need_restock: false,
    };
    const in_hand = productData.quantity - quantity;
    if (in_hand < productData.notification) {
      data["need_restock"] = true;
      data["other_info"] = {
        barcode: productData.barcode,
        product_name: productData.product_name,
        id: productData.id,
        in_hand,
        status: in_hand > 0 ? "warn" : "danger",
      };
    }
    const exist = basket.find((item) => item.barcode === data.barcode);
    if (exist === undefined && basket.length === 0) {
      setBasket([data]);
      setScanned(false);
      setIsLoading(false);
      return;
    } else if (exist === undefined) {
      setBasket([...basket, data]);
    } else if (basket.length) {
      const filtered = basket.filter(
        (item, index) => item.barcode !== data.barcode
      );
      data.quantity = data.quantity + exist.quantity;
      data.total = data.total + exist.total;
      if (filtered.length && filtered !== undefined) {
        setBasket([...filtered, data]);
        setScanned(false);
        setIsLoading(false);
        return;
      }
      setBasket([data]);
      setScanned(false);
      setIsLoading(false);
    }
    setScanned(false);
    setIsLoading(false);
  };
  const checkQuantity = () => {
    if (quantity === "" || quantity === 0) {
      return;
    }
    if (quantity > productData.quantity) {
      setErrorMessage(`There is only ${productData.quantity} left`);
      return false;
    } else {
      addToBasket();
    }
  };
  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        width: "100%",
        // minHeight: 200,
        padding: scanning || noData || isLoading ? 30 : 20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: cxlxrs.white,
        justifyContent:
          scanning || noData || isLoading ? "center" : "flex-start",
        alignItems: "center",
      }}
    >
      <View style={{ width: "100%", alignItems: "center" }}>
        {errorMessage !== "" ? (
          <CustomPopUp
            message={`${errorMessage}`}
            type={"error"}
            customStyles={{
              backgroundColor: cxlxrs.danger,
              borderRadius: 30,
              justifyContent: "center",
              height: 30,
              paddingVertical: 0,
              marginTop: -140,
            }}
            customTextStyles={{ color: "#ffffff", textAlign: "center" }}
          />
        ) : null}
      </View>
      {scanning && <Text style={{}}>{scanning ? "Scanning..." : barcode}</Text>}
      {!scanning ? (
        <>
          {isLoading ? (
            <ActivityIndicator
              size="large"
              color={cxlxrs.black}
              style={{ marginBottom: 10 }}
            />
          ) : noData ? (
            <Text
              style={{
                textAlign: "center",
                fontFamily: FontFamily.FiraMedium,
              }}
            >
              Product does'nt exist in inventory!
            </Text>
          ) : (
            <>
              <View style={styles.cardInfo}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.cardInfoName}>
                    {productData.product_name}
                  </Text>
                  <Text style={styles.cardInfoPrice}>₦{productData.price}</Text>
                </View>
                <View style={styles.cardInfoSub}>
                  <Text style={styles.cardInfoSubText}>
                    Sold: {productData.product_sold_since_last_restock}
                  </Text>
                  <Text style={styles.cardInfoSubText}>
                    {productData.status === "In Stock"
                      ? `In Stock: ${productData.quantity}`
                      : `Sold Out`}
                  </Text>
                </View>
              </View>
              <CustomInput
                onChange={(e) => {
                  setErrorMessage("");
                  setQuantity(e * 1);
                }}
                placeholder="Quantity"
                value={quantity * 1}
                keyType="numeric"
              />
              <AppButton
                onPress={() => {
                  checkQuantity();
                }}
                title="Sell"
                customStyle={styles.addBtn}
                textStyle={styles.addBtnText}
              />
            </>
          )}
        </>
      ) : null}
    </View>
  );
}

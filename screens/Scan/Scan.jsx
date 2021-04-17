import React, { useState } from "react";
import { ActivityIndicator, View, Text } from "react-native";
import { throttle } from "lodash";
import { Camera } from "expo-camera";
import { cxlxrs } from "../../constants/Colors";
import BarCodeScreen from "../../components/CodeScanner/CodeScanner";
import AppButton from "../../components/AppButton/AppButton";
import { useSelector } from "react-redux";

import { styles } from "./styles";
import { firestore } from "../../firebase/config";

const Scan = ({ navigation }) => {
  const user = useSelector(({ user }) => user.currentUser);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanning, setScanning] = useState(true);
  const [barcode, setBarcode] = useState("");
  const [noData, setNoData] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [productData, setProductData] = useState({});

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, [""]);
  const getProductData = async (barcode) => {
    const productsRef = firestore
      .collection("products")
      .doc(user.id)
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

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  function DetailsViewer() {
    return (
      <View
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          minHeight: 220,
          padding: 30,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          backgroundColor: cxlxrs.white,
          justifyContent:
            scanning || noData || isLoading ? "center" : "flex-start",
          alignItems: "center",
        }}
      >
        {scanning && (
          <Text style={{}}>{scanning ? "Scanning..." : barcode}</Text>
        )}
        {!scanning ? (
          <>
            {isLoading ? (
              <ActivityIndicator
                size="large"
                color={cxlxrs.black}
                style={{ marginBottom: 10 }}
              />
            ) : noData ? (
              <Text style={{}}>This product is not yet registered!</Text>
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
                    <Text style={styles.cardInfoPrice}>
                      ₦{productData.price}
                    </Text>
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
                {/* <AppButton
                  onPress={() => {
                    navigation.navigate("ProductView", { data: productData });
                  }}
                  title="View Product"
                  customStyle={styles.addBtn}
                  textStyle={styles.addBtnText}
                /> */}
              </>
            )}
          </>
        ) : null}
      </View>
    );
  }

  const onBarCodeRead = throttle((info) => {
    setNoData(false);
    setScanned(true);
    setScanning(false);
    setIsLoading(true);
    getProductData(info.data);
    setBarcode(info.data);
  }, 1000);

  return (
    <View style={{ flex: 1, backgroundColor: cxlxrs.transparent }}>
      <BarCodeScreen
        scanned={scanned}
        setScanned={setScanned}
        setScanning={setScanning}
        handleBarCodeScanned={onBarCodeRead}
      />
      {DetailsViewer()}
    </View>
  );
};

export default Scan;

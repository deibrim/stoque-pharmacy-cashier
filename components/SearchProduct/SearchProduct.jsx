import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Modal,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { firestore } from "../../firebase/config";
import { styles } from "./styles";
import { cxlxrs } from "../../constants/Colors";
import AppButton from "../AppButton/AppButton";
import { Ionicons } from "@expo/vector-icons";
import CustomInput from "../CustomInput/CustomInput";
import CustomPopUp from "../CustomPopUp/CustomPopUp";
import AddProductInput from "../AddProductInput/AddProductInput";
import ProductPreview from "../ProductPreview/ProductPreview";
const SearchProduct = ({
  searchVisible,
  setSearchVisible,
  basket,
  setBasket,
}) => {
  const user = useSelector(({ user }) => user.currentUser);
  const [quantity, setQuantity] = useState("");
  const [searched, setSearched] = useState(false);
  const [query, setQuery] = useState("");
  const [noData, setNoData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [productData, setProductData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [selected, setSelected] = useState({});
  useEffect(() => {}, []);
  const getProductData = async () => {
    setIsLoading(true);
    setErrorMessage("");
    const productsRef = firestore
      .collection("products")
      .doc(user.id)
      .collection("products")
      .where("query", ">=", query.toLowerCase());
    const snapshot = await productsRef.get();
    if (snapshot.empty) {
      setNoData(true);
      setIsLoading(false);
      setSearched(true);
      return;
    }
    const products = [];
    snapshot.docs.forEach((item) => {
      products.push(item.data());
    });
    setProductData(products);
    setSearched(true);
    setIsLoading(false);
  };
  const checkQuantity = () => {
    if (quantity > productData.quantity) {
      setErrorMessage(`There is only ${productData.quantity} left`);
      return false;
    } else {
      // Add to
      const data = {
        barcode: productData.barcode,
        product_name: productData.product_name,
        quantity,
        id: productData.id,
        price: productData.price,
        total: productData.price * quantity,
      };
      setBasket([...basket, data]);
      setScanned(false);
      setIsLoading(false);
    }
  };
  return (
    <Modal
      animationType="fade"
      transparent={false}
      statusBarTranslucent={true}
      visible={searchVisible}
      onRequestClose={() => {}}
    >
      <View
        style={{
          width: "100%",
          height: Dimensions.get("screen").height,
          backgroundColor: cxlxrs.white,
          flex: 1,
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
          onPress={() => setSearchVisible(false)}
        >
          <Ionicons name="close" size={20} color={cxlxrs.danger} />
        </TouchableOpacity>
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
        <View style={[styles.flexGrouping, { marginBottom: "auto" }]}>
          <AddProductInput
            label="Search"
            value={query}
            onChangeText={(e) => {
              setErrorMessage("");
              setQuery(e);
            }}
            keyType="default"
            containerStyle={{
              width: "85%",
            }}
          />
          <TouchableOpacity
            onPress={getProductData}
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              width: 40,
              borderRadius: 30,
              backgroundColor: cxlxrs.black,
              height: 40,
            }}
          >
            <Ionicons name="search" size={20} color={cxlxrs.white} />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <ActivityIndicator
            size="large"
            color={cxlxrs.black}
            style={{ marginBottom: 10 }}
          />
        ) : noData ? (
          <Text style={{}}>Product does'nt exist in inventory</Text>
        ) : (
          <>
            {/* {productData.map((item, index) => (
              <ProductPreview key={index} data={item} />
            ))} */}
            <SafeAreaView style={{ flex: 1 }}>
              <View style={styles.listContainer}>
                <FlatList
                  data={productData}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <ProductPreview
                      data={item}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  )}
                  contentContainerStyle={{
                    flexGrow: 1,
                  }}
                  style={{ paddingBottom: 20 }}
                  initialNumToRender={15}
                  // onEndReachedThreshold={0.1}
                />
              </View>
            </SafeAreaView>
            {selected.product_name ? (
              <>
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
            ) : null}
          </>
        )}
      </View>
    </Modal>
  );
};

export default SearchProduct;

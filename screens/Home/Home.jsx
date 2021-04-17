import {
  AntDesign,
  Feather,
  FontAwesome,
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AppButton from "../../components/AppButton/AppButton";
import HelperDialog from "../../components/HelperDialog/HelperDialog";
import OverviewBox from "../../components/OverviewBox/OverviewBox";
import TransactionPreview from "../../components/TransactionPreview/TransactionPreview";
import { cxlxrs } from "../../constants/Colors";
import { Images } from "../../constants/images";
import { firestore } from "../../firebase/config";
import { setCurrentUser } from "../../redux/user/actions";
import { Wait } from "../../utils/helper";
import { styles } from "./styles";

const Home = () => {
  const user = useSelector(({ user }) => user.currentUser);
  const [latestSale, setLatestSale] = useState({});
  const [latestSales, setLatestSales] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [isLatestSaleLoading, setIsLatestSaleLoading] = useState(true);
  const [invoices, setInvoices] = useState("0");
  const [sold, setSold] = useState("0");
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const timeString = new Date(Date.now()).toISOString().substring(0, 10);
  const latestSalesRef = firestore
    .collection("sales")
    .doc(user.id)
    .collection("sales")
    .where("cashier_id", "==", `${user.id}`)
    .where("day_created", "==", `${timeString}`);
  const fetchData = useCallback(async () => {
    latestSalesRef.onSnapshot((snapShot) => {
      const salesArr = [];
      if (!snapShot.empty) {
        const docs = snapShot.docs;
        docs.forEach((item, index) => {
          salesArr.push(item.data());
          const arrLength = docs.length - 1;
          if (index === arrLength) {
            console.log(docs.length);
            setLatestSales(salesArr);
            setIsLatestSaleLoading(false);
          }
        });
        setLatestSale(snapShot.docs[0].data());
        setIsLatestSaleLoading(false);
      }
    });
  }, [latestSale]);
  useEffect(() => {
    fetchData();
  }, [""]);
  const handleSignout = () => {
    setDialogVisible(false);
    Wait(2000).then(() => {
      dispatch(setCurrentUser(null));
    });
  };
  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setDialogVisible(true)}>
          <View style={styles.noty}>
            <AntDesign name="logout" size={24} color={cxlxrs.danger} />
          </View>
        </TouchableOpacity>
        <Text style={styles.title}>
          {" "}
          Hi,{" "}
          <Text
            style={{
              color: cxlxrs.black,
            }}
          >
            {user.name.split(" ")[0] || "Ibrahim"}
          </Text>
        </Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
            <View style={styles.imageContainer}>
              <FontAwesome name="user" size={20} color="black" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <HelperDialog
        visible={dialogVisible}
        setDialogVisible={setDialogVisible}
        title={"More"}
      >
        <TouchableOpacity
          style={[styles.modalTextButton]}
          onPress={handleSignout}
        >
          <Feather
            name="log-out"
            size={20}
            color="red"
            style={{ marginRight: 20 }}
          />
          <Text style={[styles.modalText, { color: "red" }]}>Logout</Text>
        </TouchableOpacity>
      </HelperDialog>
      <View style={styles.container}>
        <View style={styles.overviews}>
          <OverviewBox
            label="Sold"
            count={sold}
            onPress={() => {}}
            icon={
              <MaterialIcons name="inventory" size={20} color={cxlxrs.white} />
            }
            bgColor={cxlxrs.black}
            textColor={cxlxrs.white}
          />
          <OverviewBox
            label="Invoices"
            count={invoices}
            onPress={() => {}}
            icon={
              <Image
                source={Images.invoiceIcon}
                style={{ height: 20, width: 20 }}
              />
            }
            bgColor={cxlxrs.white}
            textColor={cxlxrs.black}
          />
        </View>
        <ScrollView style={{ flex: 1, height: "100%" }}>
          <View style={styles.section}>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.sectionTitle}>Transaction</Text>

              <TouchableOpacity
                onPress={() => navigation.navigate("Transactions")}
              >
                <Text style={styles.sectionLink}>View all</Text>
              </TouchableOpacity>
            </View>
            {isLatestSaleLoading ? (
              <View
                style={{
                  minHeight: 100,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ActivityIndicator
                  size="large"
                  color={cxlxrs.black}
                  style={{ marginBottom: 10 }}
                />
              </View>
            ) : (
              // latestSales.map((item, index) => (
              //   <TransactionPreview data={item} key={index} />
              // ))
              <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.listContainer}>
                  <FlatList
                    data={latestSales}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                      <TransactionPreview data={item} />
                    )}
                    contentContainerStyle={{
                      flexGrow: 1,
                    }}
                    style={{ paddingBottom: 20 }}
                    initialNumToRender={3}
                    // onEndReachedThreshold={0.1}
                  />
                </View>
              </SafeAreaView>
            )}
          </View>
        </ScrollView>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingRight: 10,
          width: "100%",
          position: "absolute",
          bottom: 70,
        }}
      >
        <AppButton
          onPress={() => navigation.navigate("MakeSale")}
          title="Make Sale"
          customStyle={styles.makeSaleBtn}
          textStyle={styles.makeSaleBtnText}
        />
      </View>
    </>
  );
};

export default Home;

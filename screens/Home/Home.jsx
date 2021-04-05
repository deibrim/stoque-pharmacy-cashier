import {
  AntDesign,
  FontAwesome,
  FontAwesome5,
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AppButton from "../../components/AppButton/AppButton";
import OverviewBox from "../../components/OverviewBox/OverviewBox";
import { cxlxrs } from "../../constants/Colors";
import { firestore } from "../../firebase/config";
import { styles } from "./styles";

const Home = () => {
  const user = useSelector(({ user }) => user.currentUser);
  const [productCount, setProductCount] = useState("0");
  const [cashierCount, setCashierCount] = useState("0");
  const [latestSale, setLatestSale] = useState({});
  const [revenue, setRevenue] = useState("0");
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const productsRef = firestore
    .collection("products")
    .doc(user.id)
    .collection("products");
  const cashiersRef = firestore
    .collection("employees")
    .doc(user.id)
    .collection("cashiers");
  const statsRef = firestore.collection("stats").doc(user.id);
  const latestSalesRef = firestore
    .collection("sales")
    .doc(user.id)
    .collection("sales");
  const fetchData = async () => {
    productsRef.onSnapshot((snapShot) => setProductCount(snapShot.size));
    cashiersRef.onSnapshot((snapShot) => setCashierCount(snapShot.size));
    statsRef.onSnapshot((snapShot) => {
      if (!snapShot.exists) {
        return;
      }
      setRevenue(snapShot.data().revenue);
    });
    latestSalesRef
      .orderBy("created_at")
      .limit(1)
      .onSnapshot((snapShot) => {
        !snapShot.empty && setLatestSale(snapShot.docs[0].data());
      });
  };
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {}}>
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
            {user.firstName || "Ibrahim"}
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
              {/* <Image style={styles.profilePic} source={avatar} /> */}
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.overviews}>
          <OverviewBox
            label="Sold"
            count={productCount}
            onPress={() => navigation.navigate("Products")}
            icon={
              <MaterialIcons name="inventory" size={20} color={cxlxrs.white} />
            }
            bgColor={cxlxrs.black}
            textColor={cxlxrs.white}
          />
          <OverviewBox
            label="Invoices"
            count={cashierCount}
            onPress={() => navigation.navigate("Cashiers")}
            icon={<FontAwesome5 name="users" size={20} color={cxlxrs.black} />}
            bgColor={cxlxrs.white}
            textColor={cxlxrs.black}
          />
        </View>
        <ScrollView>
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
              <Text style={styles.sectionLink}>View all</Text>
            </View>
            <TouchableWithoutFeedback>
              <View style={styles.transaction}>
                {/* <View style={styles.transactionIcon}></View> */}
                <View style={styles.transactionTexts}>
                  <View style={styles.transactionTextLeft}>
                    <Text style={styles.transactionName}>
                      {`Product sold by ${latestSale.cashier || "Emily"}`}
                    </Text>
                    <View style={styles.transactionSubtext}>
                      <Text style={styles.transactionTime}>
                        {latestSale.created_at
                          ? moment(latestSale.created_at).fromNow()
                          : "10 min ago"}
                      </Text>
                      <Text style={styles.transactionProductCount}>
                        {`${latestSale.productCount || 21} Products`}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.transactionTextRight}>
                    <Text style={styles.transactionId}>
                      {latestSale.id || "10ingo"}
                    </Text>
                    <Text
                      style={styles.transactionTotalPrice}
                    >{`₦${latestSale.price || "32,000"}`}</Text>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
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

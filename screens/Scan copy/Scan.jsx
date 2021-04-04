import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Camera } from "expo-camera";
import { Icons } from "../../constants/icons";
import { Images } from "../../constants/images";
import { cxlxrs } from "../../constants/Colors";

const Scan = ({ navigation }) => {
  const [hasPermission, setHasPermission] = React.useState(null);

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  function renderHeader() {
    return (
      <View
        style={{ flexDirection: "row", marginTop: 40, paddingHorizontal: 30 }}
      >
        <TouchableOpacity
          style={{
            width: 45,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => navigation.navigate("Home")}
        >
          <Image
            source={Icons.close}
            style={{
              height: 20,
              width: 20,
              tintColor: cxlxrs.white,
            }}
          />
        </TouchableOpacity>

        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ color: cxlxrs.white }}>Scan for Payment</Text>
        </View>

        <TouchableOpacity
          style={{
            height: 45,
            width: 45,
            backgroundColor: cxlxrs.green,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => console.log("Info")}
        >
          <Image
            source={Icons.info}
            style={{
              height: 25,
              width: 25,
              tintColor: cxlxrs.white,
            }}
          />
        </TouchableOpacity>
      </View>
    );
  }

  function renderScanFocus() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={Images.focus}
          resizeMode="stretch"
          style={{
            marginTop: "-55%",
            width: 200,
            height: 300,
          }}
        />
      </View>
    );
  }

  function renderPaymentMethods() {
    return (
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 220,
          padding: 30,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          backgroundColor: cxlxrs.white,
        }}
      >
        <Text style={{}}>Another payment methods</Text>
      </View>
    );
  }

  function onBarCodeRead(result) {
    console.log(result.data);
  }

  return (
    <View style={{ flex: 1, backgroundColor: cxlxrs.transparent }}>
      <Camera
        ref={(ref) => {
          this.camera = ref;
        }}
        style={{ flex: 1 }}
        captureAudio={false}
        type={Camera.Constants.Type.back}
        flashMode={Camera.Constants.FlashMode.off}
        onBarCodeScanned={onBarCodeRead}
        androidCameraPermissionOptions={{
          title: "Permission to use camera",
          message: "Camera is required for barcode scanning",
          buttonPositive: "OK",
          buttonNegative: "Cancel",
        }}
      >
        {renderHeader()}
        {renderScanFocus()}
        {/* {renderPaymentMethods()} */}
      </Camera>
    </View>
  );
};

export default Scan;

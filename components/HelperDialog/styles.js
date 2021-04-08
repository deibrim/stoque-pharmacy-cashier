import { Dimensions, StyleSheet } from "react-native";
import { cxlxrs } from "../../constants/Colors";
export const styles = StyleSheet.create({
  modal: {
    width: "100%",
    height: Dimensions.get("screen").height,
    backgroundColor: cxlxrs.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 30,
  },

  title: {
    color: "#42414C",
    fontSize: 16,
    marginLeft: -2,
    marginBottom: 0,
    fontFamily: "FiraCode-SemiBold",
    textAlign: "center",
  },

  customDialogTitle: {
    paddingVertical: 5,
    borderBottomColor: "#44444444",
    borderBottomWidth: 1,
    width: "100%",
  },

  modalTextButton: {
    marginVertical: 3,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  modalText: {
    color: "#111111",
    fontWeight: "600",
    fontSize: 15,
  },
});

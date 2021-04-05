import { Dimensions, StyleSheet } from "react-native";
import { cxlxrs } from "../../constants/Colors";
import { FontFamily } from "../../constants/Fonts";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cxlxrs.white,
    paddingHorizontal: 10,
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 10,
    minHeight: 80,
    backgroundColor: cxlxrs.white,
    justifyContent: "space-between",
  },
  routeTitle: {
    color: cxlxrs.black,
    fontSize: 14,
    letterSpacing: 1,
    fontFamily: FontFamily.FiraMedium,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tableText: {
    fontFamily: FontFamily.FiraBold,
    textTransform: "capitalize",
    fontWeight: "400",
    fontSize: 12,
    color: cxlxrs.black,
    width: (Dimensions.get("window").width - 20) / 4,
    textAlign: "right",
  },
  tableTextLong: {
    textAlign: "left",
    width: (Dimensions.get("window").width - 20) / 2,
  },
  tableBodyText: {
    fontFamily: FontFamily.FiraRegular,
  },
  tableFooter: {
    marginTop: 30,
  },
  addBtn: {
    backgroundColor: cxlxrs.white,
    borderRadius: 30,
    height: 40,
    width: "90%",
  },
  addBtnText: {
    fontFamily: FontFamily.FiraBold,
    textTransform: "capitalize",
    fontWeight: "400",
    fontSize: 12,
    color: cxlxrs.black,
  },
  iconContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 30,
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  bottomButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    position: "absolute",
    bottom: 20,
  },
  bottomButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

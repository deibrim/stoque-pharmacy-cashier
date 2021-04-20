import { StyleSheet } from "react-native";
import { cxlxrs } from "../../constants/Colors";
import { FontFamily } from "../../constants/Fonts";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cxlxrs.white,
  },
  header: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 15,
    paddingLeft: 10,
    paddingRight: 20,
    minHeight: 80,
    backgroundColor: cxlxrs.white,
    justifyContent: "space-between",
  },
  routeTitle: {
    color: cxlxrs.black,
    fontSize: 14,
    letterSpacing: 1,
  },
  noData: {
    alignItems: "center",
    minHeight: 100,
    marginVertical: 20,
    marginHorizontal: 10,
  },
  noDataText: {
    textAlign: "center",
    fontSize: 13,
    color: "#97989A",
    lineHeight: 30,
    marginVertical: 20,
    fontFamily: "FiraCode-Regular",
    letterSpacing: 0.5,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 70,
    width: "100%",
    backgroundColor: "transparent",
    alignItems: "center",
  },
  dateSelector: {
    backgroundColor: "#ffffff",
    height: 40,
    width: "60%",
  },
  dateSelectorText: {
    fontFamily: FontFamily.FiraBold,
    textTransform: "capitalize",
    fontWeight: "400",
    fontSize: 12,
    color: cxlxrs.black,
  },
});

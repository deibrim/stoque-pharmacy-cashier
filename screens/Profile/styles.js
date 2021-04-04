import { StyleSheet } from "react-native";
import { colors, cxlxrs } from "../../constants/Colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 15,
    paddingLeft: 20,
    paddingRight: 10,
    minHeight: 80,
    backgroundColor: "#ffffff",
    justifyContent: "space-between",
  },
  routeTitle: {
    color: cxlxrs.black,
    fontSize: 16,
    letterSpacing: 1,
  },
  userPreview: {
    alignItems: "center",
  },
  userImageContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 30,
    paddingBottom: 20,
  },
  userImage: {
    width: 110,
    height: 110,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#cd9931",
  },
  usernameContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  username: {
    color: "#42414C",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
    marginLeft: -2,
    letterSpacing: 1,
    fontFamily: "FiraCode-SemiBold",
  },
  modalTextButton: {
    marginVertical: 3,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  modalText: {
    color: "#111111",
    fontSize: 14,
    fontFamily: "FiraCode-Regular",
  },
  settings: {
    marginTop: 50,
    // marginTop: "auto",
  },
  invite: {
    flexDirection: "row",
    alignItems: "center",
    alignItems: "center",
    backgroundColor: "#dddcdb",
    borderRadius: 40,
    padding: 10,
    position: "relative",
    marginHorizontal: 20,
    marginBottom: 20,
    marginTop: "auto",
  },
  icon: {
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    elevation: 3,
    transform: [{ rotate: "-90deg" }],
  },
  inviteTexts: {
    marginLeft: 10,
  },
  inviteTextMain: {
    fontFamily: "FiraCode-SemiBold",
    fontSize: 12,
  },
  inviteTextSub: {
    fontFamily: "FiraCode-Regular",
    letterSpacing: 0.05,
    fontSize: 10,
  },
  inviteTextBold: {
    fontFamily: "FiraCode-SemiBold",
    fontSize: 12,
    color: colors[0],
  },
});

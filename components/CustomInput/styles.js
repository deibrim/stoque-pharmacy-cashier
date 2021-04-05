import { StyleSheet } from "react-native";
import { FontFamily } from "../../constants/Fonts";

export const styles = StyleSheet.create({
  inputGroup: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 10,
    marginHorizontal: 20,
    borderRadius: 25,
  },
  inputGroupIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 5,
    paddingRight: 10,
    paddingLeft: 0,
    backgroundColor: "#fff",
    color: "#424242",
    borderRadius: 25,
    paddingLeft: 10,
    fontSize: 12,
    fontFamily: FontFamily.FiraMedium,
  },
});

import { Feather } from "@expo/vector-icons";
import { TextInput, StyleSheet, View } from "react-native";

const Search = () => {
  return (
    <View style={styles.searchContainer}>
      <Feather
        name="search"
        size={18}
        color="#BDBDBD"
        style={styles.searchIcon}
      />
      <TextInput
        style={styles.searchInput}
        placeholder="Search"
        placeholderTextColor="#BDBDBD"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    height: 40,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000000",
  },
});
export default Search;

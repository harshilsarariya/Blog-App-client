import { View, Text, TextInput, ScrollView, StyleSheet } from "react-native";
import React, { useState } from "react";
import Constants from "expo-constants";
import { searchPosts, getSinglePost } from "../api/post";
import PostListItem from "./PostListItem";
import { useNavigation } from "@react-navigation/native";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigation = useNavigation();
  const [notFound, setNotFound] = useState(false);

  const handleOnSubmit = async () => {
    if (!query.trim()) return;

    // submit the form
    const { error, posts } = await searchPosts(query);
    if (error) console.log(error);

    if (!posts.length) return setNotFound(true);
    setNotFound(false);
    setResults([...posts]);
  };

  const handlePostPress = async (slug) => {
    const { error, post } = await getSinglePost(slug);

    if (error) console.log(error);
    navigation.navigate("PostDetail", { post });
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={query}
        onChangeText={(text) => setQuery(text)}
        placeholder="Search..."
        style={styles.searchInput}
        onSubmitEditing={handleOnSubmit}
      />

      <ScrollView contentContainerStyle={{ flex: 1 }}>
        {notFound ? (
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 22,
              color: "rgba(0,0,0,0.3)",
              textAlign: "center",
              marginTop: 30,
            }}
          >
            Result Not Found
          </Text>
        ) : (
          results.map((post) => {
            return (
              <View ley={post.id} style={{ marginTop: 10 }}>
                <PostListItem
                  post={post}
                  onPress={() => handlePostPress(post.slug)}
                />
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    padding: 10,
    flex: 1,
  },
  searchInput: {
    borderWidth: 2,
    borderColor: "#383838",
    borderRadius: 5,
    padding: 8,
  },
});

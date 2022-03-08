import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  Alert,
} from "react-native";
import React from "react";
import dateFormat from "dateformat";
const { width } = Dimensions.get("window");
import Markdown from "react-native-markdown-display";
import * as Linking from "expo-linking";
import { getSinglePost } from "../api/post";
import RelatedPosts from "./RelatedPosts";
import Seprator from "./Seprator";

const MY_WEBSITE_LINK = "myblog.com/blog";

const PostDetail = ({ route, navigation }) => {
  const post = route.params.post;
  if (!post) return null;

  const getImage = (uri) => {
    if (uri) return { uri };
    return require("../../assets/blank.jpg");
  };

  const rules = {
    paragraph: (node, children, parent, styles) => (
      <Text key={node.key} style={styles.paragraph} selectable>
        {children}
      </Text>
    ),
    // image:
  };

  const handleSinglePostFetch = async (slug) => {
    const { error, post } = await getSinglePost(slug);
    if (error) console.log(error);

    navigation.push("PostDetail", { post });
  };

  const handleOnLinkPress = async (url) => {
    if (url.includes(MY_WEBSITE_LINK)) {
      const slug = url.split(MY_WEBSITE_LINK + "/")[1];

      if (!slug) return false;
      handleSinglePostFetch(slug);

      return false;
    }
    const res = await Linking.canOpenURL(url);
    if (res) {
      Linking.openURL(url);
    } else {
      Alert.alert("Invalid URL", "Can't open broken link!");
    }
  };

  const { thumbnail, title, createdAt, author, content, tags } = post;

  return (
    <ScrollView>
      <Image
        source={getImage(thumbnail)}
        style={{ width, height: width / 1.7 }}
      />
      <View style={{ padding: 10 }}>
        <Text
          style={{
            fontWeight: "bold",
            color: "#383838",
            fontSize: 22,
          }}
        >
          {title}
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 3,
          }}
        >
          <Text style={{ color: "#827e7e" }}>By {author}</Text>
          <Text style={{ color: "#827e7e" }}>
            {dateFormat(createdAt, "mediumDate")}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text selectable style={{ color: "#827e7e" }}>
            Tags
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {tags.map((tag, index) => (
              <Text style={{ marginLeft: 5, color: "blue" }} key={tag + index}>
                #{tag}
              </Text>
            ))}
          </View>
        </View>
        <Markdown
          // rules={rules}
          style={styles}
          onLinkPress={handleOnLinkPress}
        >
          {content}
        </Markdown>
      </View>
      <View style={{ padding: 10 }}>
        <Text
          style={{
            fontWeight: "bold",
            color: "#383838",
            marginBottom: 10,
            fontSize: 22,
          }}
        >
          Related Posts
        </Text>
        <Seprator width="100%" />
        <View>
          <RelatedPosts OnPostPress={handleSinglePostFetch} postId={post.id} />
        </View>
      </View>
    </ScrollView>
  );
};

export default PostDetail;

const styles = StyleSheet.create({
  paragraph: {
    lineHeight: 22,
    color: "#545050",
    letterSpacing: 0.8,
    textAlign: "justify",
  },
  body: {
    fontSize: 16,
  },
  link: { color: "#7784f8" },
  list_item: {
    letterSpacing: 0.9,
    color: "#545050",
    paddingVertical: 5,
  },
});

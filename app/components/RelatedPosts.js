import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import PostListItem from "./PostListItem";
import { getSinglePost, getSimilerPosts } from "../api/post";

const RelatedPosts = ({ postId, OnPostPress }) => {
  const [posts, setPosts] = useState([]);

  const fetchSimillerPosts = async () => {
    const { error, posts } = await getSimilerPosts(postId);

    if (error) console.log(error);
    setPosts([...posts]);
  };

  useEffect(() => {
    fetchSimillerPosts();
  }, [postId]);

  return posts.map((post) => {
    return (
      <View key={post.id} style={{ marginTop: 18 }}>
        <PostListItem post={post} onPress={() => OnPostPress(post.slug)} />
      </View>
    );
  });
};

export default RelatedPosts;

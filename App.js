
import React, { useState } from "react";
import {
  View, Text, TextInput, ScrollView,
  Pressable, StyleSheet, SafeAreaView,
  StatusBar, Modal, Share, Alert
} from "react-native";

export default function App() {
  const [name, setName] = useState("Zillur");
  const [language, setLanguage] = useState("bn");
  const [draft, setDraft] = useState("");
  const [commentText, setCommentText] = useState("");
  const [commentPostId, setCommentPostId] = useState(null);
  const [activeTab, setActiveTab] = useState("home");

  const [posts, setPosts] = useState([
    {
      id: "1",
      name: "Friendly",
      text: "Welcome to Friendly! 💙",
      likes: 0,
      liked: false,
      comments: []
    },
    {
      id: "2",
      name: "Zillur",
      text: "বন্ধুত্বের নতুন ঠিকানা Friendly 😊",
      likes: 0,
      liked: false,
      comments: []
    }
  ]);

  const t = (bn, en) => language === "bn" ? bn : en;

  const addPost = () => {
    if (!draft.trim()) {
      Alert.alert(t("লিখুন", "Write something"), t("পোস্ট লিখুন", "Please write a post"));
      return;
    }

    const newPost = {
      id: Date.now().toString(),
      name,
      text: draft.trim(),
      likes: 0,
      liked: false,
      comments: []
    };

    setPosts([newPost, ...posts]);
    setDraft("");
    setActiveTab("home");
  };

  const toggleLike = (id) => {
    setPosts(old =>
      old.map(post =>
        post.id === id
          ? {
              ...post,
              liked: !post.liked,
              likes: post.likes + (post.liked ? -1 : 1)
            }
          : post
      )
    );
  };

  const addComment = () => {
    if (!commentText.trim()) return;

    setPosts(old =>
      old.map(post =>
        post.id === commentPostId
          ? {
              ...post,
              comments: [...post.comments, {
                name,
                text: commentText.trim()
              }]
            }
          : post
      )
    );

    setCommentText("");
  };

  const sharePost = async (post) => {
    try {
      await Share.share({
        message: post.name + ": " + post.text + "\n\nFriendly 💙"
      });
    } catch (error) {
      Alert.alert("Friendly", "Share failed");
    }
  };

  const selectedPost = posts.find(
    post => post.id === commentPostId
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.logo}>Friendly 💙</Text>

        <Pressable
          onPress={() => setLanguage(language === "bn" ? "en" : "bn")}
        >
          <Text style={styles.language}>
            {language === "bn" ? "EN" : "বাংলা"}
          </Text>
        </Pressable>
      </View>

      {activeTab === "home" ? (
        <ScrollView style={styles.content}>

          <Text style={styles.welcome}>
            {t("স্বাগতম,", "Welcome,")} {name}!
          </Text>

          <View style={styles.card}>
            <Text style={styles.heading}>
              {t("নতুন পোস্ট করুন", "Create a post")}
            </Text>

            <TextInput
              style={styles.input}
              placeholder={t("আপনি কী ভাবছেন?", "What's on your mind?")}
              value={draft}
              onChangeText={setDraft}
              multiline
            />

            <Pressable style={styles.postButton} onPress={addPost}>
              <Text style={styles.buttonText}>
                {t("পোস্ট করুন", "Post")}
              </Text>
            </Pressable>
          </View>

          <Text style={styles.heading}>
            {t("নিউজ ফিড", "News Feed")}
          </Text>

          {posts.map(post => (
            <View key={post.id} style={styles.card}>

              <Text style={styles.person}>👤 {post.name}</Text>

              <Text style={styles.postText}>{post.text}</Text>

              <View style={styles.actions}>

                <Pressable onPress={() => toggleLike(post.id)}>
                  <Text style={[
                    styles.actionText,
                    post.liked && styles.liked
                  ]}>
                    {post.liked ? "❤️" : "♡"} {t("লাইক", "Like")} {post.likes}
                  </Text>
                </Pressable>

                <Pressable onPress={() => setCommentPostId(post.id)}>
                  <Text style={styles.actionText}>
                    💬 {t("কমেন্ট", "Comment")} {post.comments.length}
                  </Text>
                </Pressable>

                <Pressable onPress={() => sharePost(post)}>
                  <Text style={styles.actionText}>
                    📤 {t("শেয়ার", "Share")}
                  </Text>
                </Pressable>

              </View>

              {post.comments.map((comment, index) => (
                <Text key={index} style={styles.comment}>
                  {comment.name}: {comment.text}
                </Text>
              ))}

            </View>
          ))}

        </ScrollView>
      ) : activeTab === "profile" ? (
        <View style={styles.card}>
          <Text style={styles.heading}>
            {t("আপনার প্রোফাইল", "Your Profile")}
          </Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder={t("আপনার নাম", "Your name")}
          />
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.heading}>
            {activeTab === "friends"
              ? t("বন্ধু", "Friends")
              : t("নোটিফিকেশন", "Notifications")}
          </Text>
          <Text>{t("শীঘ্রই আসছে", "Coming soon")}</Text>
        </View>
      )}

      <View style={styles.nav}>
        {[
          ["home", "🏠", "হোম", "Home"],
          ["friends", "👥", "বন্ধু", "Friends"],
          ["notifications", "🔔", "নোটিশ", "Alerts"],
          ["profile", "👤", "প্রোফাইল", "Profile"]
        ].map(([id, icon, bn, en]) => (
          <Pressable
            key={id}
            onPress={() => setActiveTab(id)}
            style={styles.navItem}
          >
            <Text style={[
              styles.navText,
              activeTab === id && styles.active
            ]}>
              {icon}{"\n"}{t(bn, en)}
            </Text>
          </Pressable>
        ))}
      </View>

      <Modal
        visible={commentPostId !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setCommentPostId(null)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalCard}>

            <Text style={styles.heading}>
              {t("কমেন্ট", "Comments")}
            </Text>

            <ScrollView style={{ maxHeight: 250 }}>
              {selectedPost?.comments.map((comment, index) => (
                <Text key={index} style={styles.comment}>
                  {comment.name}: {comment.text}
                </Text>
              ))}
            </ScrollView>

            <TextInput
              style={styles.input}
              placeholder={t("কমেন্ট লিখুন...", "Write a comment...")}
              value={commentText}
              onChangeText={setCommentText}
            />

            <Pressable style={styles.postButton} onPress={addComment}>
              <Text style={styles.buttonText}>
                {t("কমেন্ট পাঠান", "Send Comment")}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setCommentPostId(null)}
              style={styles.closeButton}
            >
              <Text style={styles.actionText}>
                {t("বন্ধ করুন", "Close")}
              </Text>
            </Pressable>

          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F5FA"
  },
  header: {
    backgroundColor: "white",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  logo: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#3978F6"
  },
  language: {
    color: "#3978F6",
    fontWeight: "bold"
  },
  content: {
    flex: 1,
    padding: 14
  },
  welcome: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#17243B",
    marginVertical: 12
  },
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 15,
    marginVertical: 9
  },
  heading: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#17243B",
    marginBottom: 12
  },
  input: {
    backgroundColor: "#F2F5FA",
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    minHeight: 48,
    marginVertical: 8
  },
  postButton: {
    backgroundColor: "#3978F6",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 6
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16
  },
  person: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#26344D"
  },
  postText: {
    fontSize: 17,
    color: "#26344D",
    paddingVertical: 15
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderColor: "#EEEEEE",
    paddingTop: 13
  },
  actionText: {
    color: "#3978F6",
    fontSize: 14,
    fontWeight: "bold"
  },
  liked: {
    color: "#E53955"
  },
  comment: {
    backgroundColor: "#F2F5FA",
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
    color: "#26344D"
  },
  nav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "white",
    paddingVertical: 12
  },
  navItem: {
    alignItems: "center"
  },
  navText: {
    textAlign: "center",
    color: "#78849A",
    fontSize: 12,
    fontWeight: "bold"
  },
  active: {
    color: "#3978F6"
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    padding: 20
  },
  modalCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16
  },
  closeButton: {
    alignItems: "center",
    padding: 12
  }
});

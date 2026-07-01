import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const API_URL = "http://localhost:8000/ask";

const SUGGESTIONS = [
  "CTR en düşük kampanya hangisi?",
  "Anormal kampanyalar hangileri?",
  "Toplam kaç kampanya var?",
  "En çok harcama yapan kampanya?",
];

type Message = { sender: "user" | "bot"; text: string };

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage(question: string) {
    if (question.trim() === "") return;
    setMessages((prev) => [...prev, { sender: "user", text: question }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ soru: question }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { sender: "bot", text: data.cevap }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Bağlantı hatası." },
      ]);
    }
    setLoading(false);
  }

  const isEmpty = messages.length === 0;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ADIN</Text>
        <Text style={styles.headerSub}>AI Reklam Asistanı</Text>
      </View>

      <ScrollView
        style={styles.chat}
        contentContainerStyle={styles.chatContent}
      >
        {isEmpty && (
          <View style={styles.welcome}>
            <View style={styles.orb}>
              <View style={styles.orbRing} />
              <View style={styles.orbCore} />
            </View>
            <Text style={styles.welcomeTitle}>Merhaba, ben ADIN</Text>
            <Text style={styles.welcomeSub}>
              Reklam verilerin hakkında ne öğrenmek istersin?
            </Text>

            <View style={styles.suggestions}>
              {SUGGESTIONS.map((s, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.suggestion}
                  onPress={() => sendMessage(s)}
                >
                  <Text style={styles.suggestionText}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {messages.map((m, i) => (
          <View
            key={i}
            style={[
              styles.bubbleRow,
              m.sender === "user" ? styles.rowRight : styles.rowLeft,
            ]}
          >
            <View
              style={[
                styles.bubble,
                m.sender === "user" ? styles.user : styles.bot,
              ]}
            >
              <Text
                style={[
                  styles.bubbleText,
                  m.sender === "user" ? styles.userText : styles.botText,
                ]}
              >
                {m.text}
              </Text>
            </View>
          </View>
        ))}

        {loading && (
          <ActivityIndicator color="#8b7cff" style={{ marginTop: 16 }} />
        )}
      </ScrollView>

      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Bir şey sor..."
          placeholderTextColor="#6b6f8a"
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={() => sendMessage(input)}
        >
          <Text style={styles.sendText}>↑</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d0b1f" },
  header: {
    paddingTop: 64,
    paddingBottom: 16,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#1e1a3a",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 2,
  },
  headerSub: { color: "#8b7cff", fontSize: 12, marginTop: 2 },
  chat: { flex: 1 },
  chatContent: { padding: 16 },

  welcome: { alignItems: "center", paddingTop: 40 },
  orb: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#141033",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#2e2668",
  },
  orbRing: {
    position: "absolute",
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 2,
    borderColor: "#6b4fff55",
  },
  orbCore: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#6b4fff",
  },
  welcomeTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 6,
  },
  welcomeSub: {
    color: "#9a9ec4",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 28,
    paddingHorizontal: 20,
  },

  suggestions: { width: "100%", gap: 10 },
  suggestion: {
    backgroundColor: "#16123099",
    borderWidth: 1,
    borderColor: "#2a2350",
    borderRadius: 14,
    padding: 14,
  },
  suggestionText: { color: "#c9cbe8", fontSize: 14 },

  bubbleRow: { marginBottom: 12, flexDirection: "row" },
  rowRight: { justifyContent: "flex-end" },
  rowLeft: { justifyContent: "flex-start" },
  bubble: { padding: 14, borderRadius: 18, maxWidth: "82%" },
  user: { backgroundColor: "#6b4fff", borderBottomRightRadius: 4 },
  bot: {
    backgroundColor: "#191632",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#2a2350",
  },
  bubbleText: { fontSize: 15, lineHeight: 22 },
  userText: { color: "#fff" },
  botText: { color: "#e4e6f5" },

  inputBar: {
    flexDirection: "row",
    padding: 12,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: "#1e1a3a",
    backgroundColor: "#0d0b1f",
  },
  input: {
    flex: 1,
    backgroundColor: "#16123a",
    color: "#fff",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#2a2350",
  },
  sendButton: {
    backgroundColor: "#6b4fff",
    borderRadius: 14,
    width: 48,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  sendText: { color: "#fff", fontSize: 20, fontWeight: "700" },
});

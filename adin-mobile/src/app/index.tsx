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

type Mesaj = { kim: "kullanici" | "bot"; metin: string };

export default function ChatScreen() {
  const [mesajlar, setMesajlar] = useState<Mesaj[]>([]);
  const [soru, setSoru] = useState("");
  const [loading, setLoading] = useState(false);

  async function gonder() {
    if (soru.trim() === "") return;
    const yeniSoru = soru;
    setMesajlar((m) => [...m, { kim: "kullanici", metin: yeniSoru }]);
    setSoru("");
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ soru: yeniSoru }),
      });
      const data = await res.json();
      setMesajlar((m) => [...m, { kim: "bot", metin: data.cevap }]);
    } catch {
      setMesajlar((m) => [...m, { kim: "bot", metin: "Bağlantı hatası." }]);
    }
    setLoading(false);
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.baslik}>ADIN Asistan</Text>
      <ScrollView style={styles.sohbet} contentContainerStyle={{ padding: 16 }}>
        {mesajlar.map((m, i) => (
          <View
            key={i}
            style={[
              styles.balon,
              m.kim === "kullanici" ? styles.kullanici : styles.bot,
            ]}
          >
            <Text style={styles.balonMetin}>{m.metin}</Text>
          </View>
        ))}
        {loading && (
          <ActivityIndicator color="#4f7cff" style={{ marginTop: 12 }} />
        )}
      </ScrollView>
      <View style={styles.altBar}>
        <TextInput
          style={styles.input}
          value={soru}
          onChangeText={setSoru}
          placeholder="Bir şey sor..."
          placeholderTextColor="#777"
        />
        <TouchableOpacity style={styles.gonderBtn} onPress={gonder}>
          <Text style={styles.gonderText}>Gönder</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f1020", paddingTop: 60 },
  baslik: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  sohbet: { flex: 1 },
  balon: { padding: 12, borderRadius: 12, marginBottom: 10, maxWidth: "80%" },
  kullanici: { backgroundColor: "#4f7cff", alignSelf: "flex-end" },
  bot: { backgroundColor: "#1a1c2e", alignSelf: "flex-start" },
  balonMetin: { color: "#fff", fontSize: 15, lineHeight: 21 },
  altBar: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#222",
  },
  input: {
    flex: 1,
    backgroundColor: "#1a1c2e",
    color: "#fff",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  gonderBtn: {
    backgroundColor: "#4f7cff",
    borderRadius: 10,
    paddingHorizontal: 18,
    justifyContent: "center",
    marginLeft: 8,
  },
  gonderText: { color: "#fff", fontWeight: "600" },
});

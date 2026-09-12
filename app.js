import React, { useState, useRef } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import Slider from "@react-native-community/slider";
import ViewShot from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";

const PRESETS = [
  { name: "Ink on paper", fg: "#111111", bg: "#FFFFFF" },
  { name: "Navy on cream", fg: "#1E3A5F", bg: "#F6F1E4" },
  { name: "Forest on mist", fg: "#1F3D2B", bg: "#EFF3ED" },
  { name: "Charcoal on linen", fg: "#2B2B2B", bg: "#EDE7DA" },
];

const ECL = [
  { key: "L", label: "Low", pct: "7%" },
  { key: "M", label: "Medium", pct: "15%" },
  { key: "Q", label: "Quartile", pct: "25%" },
  { key: "H", label: "High", pct: "30%" },
];

export default function App() {
  const [content, setContent] = useState("https://example.com");
  const [fg, setFg] = useState("#111111");
  const [bg, setBg] = useState("#FFFFFF");
  const [size, setSize] = useState(256);
  const [ecl, setEcl] = useState("M");
  const [presetIdx, setPresetIdx] = useState(0);
  const viewShotRef = useRef(null);

  const applyPreset = (p, i) => {
    setFg(p.fg);
    setBg(p.bg);
    setPresetIdx(i);
  };

  const swapColors = () => {
    setFg(bg);
    setBg(fg);
  };

  const downloadPng = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission needed", "Allow photo library access to save the QR code.");
        return;
      }
      const uri = await viewShotRef.current.capture();
      if (Platform.OS === "android") {
        const asset = await MediaLibrary.createAssetAsync(uri);
        await MediaLibrary.createAlbumAsync("Lattice", asset, false);
        Alert.alert("Saved", "QR code saved to your gallery.");
      } else {
        await MediaLibrary.saveToLibraryAsync(uri);
        Alert.alert("Saved", "QR code saved to your photos.");
      }
    } catch (e) {
      Alert.alert("Error", "Could not save the image.");
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.kicker}>QR STUDIO</Text>
        <Text style={styles.title}>Lattice</Text>
        <Text style={styles.subtitle}>
          Type a URL or any text. The mark updates as you go. Choose colors,
          size, and correction, then download a PNG.
        </Text>

        <TouchableOpacity style={styles.downloadBtn} onPress={downloadPng}>
          <Text style={styles.downloadBtnText}>⬇  Download PNG</Text>
        </TouchableOpacity>

        {/* Content card */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.label}>Content</Text>
            <Text style={styles.meta}>{content.length} characters</Text>
          </View>
          <TextInput
            style={styles.input}
            value={content}
            onChangeText={setContent}
            multiline
            placeholder="https://example.com"
            placeholderTextColor="#9C9488"
          />

          <Text style={[styles.label, { marginTop: 20 }]}>Colors</Text>
          <View style={styles.colorRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.smallLabel}>Foreground</Text>
              <View style={styles.swatchInput}>
                <View style={[styles.swatch, { backgroundColor: fg }]} />
                <TextInput
                  style={styles.swatchText}
                  value={fg}
                  onChangeText={setFg}
                  autoCapitalize="characters"
                />
              </View>
            </View>
            <TouchableOpacity onPress={swapColors} style={styles.swapBtn}>
              <Text style={{ fontSize: 16 }}>⇄</Text>
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={styles.smallLabel}>Background</Text>
              <View style={styles.swatchInput}>
                <View style={[styles.swatch, { backgroundColor: bg, borderWidth: 1, borderColor: "#ddd" }]} />
                <TextInput
                  style={styles.swatchText}
                  value={bg}
                  onChangeText={setBg}
                  autoCapitalize="characters"
                />
              </View>
            </View>
          </View>

          <View style={styles.presetRow}>
            {PRESETS.map((p, i) => (
              <TouchableOpacity
                key={p.name}
                style={[
                  styles.presetChip,
                  presetIdx === i && styles.presetChipActive,
                ]}
                onPress={() => applyPreset(p, i)}
              >
                <View style={styles.presetIconWrap}>
                  <View style={[styles.presetIconTri, { borderTopColor: p.fg }]} />
                </View>
                <Text style={styles.presetChipText}>{p.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={[styles.rowBetween, { marginTop: 20 }]}>
            <Text style={styles.label}>Size</Text>
            <Text style={styles.meta}>{size} × {size} px</Text>
          </View>
          <Slider
            style={{ width: "100%", height: 36 }}
            minimumValue={128}
            maximumValue={512}
            step={16}
            value={size}
            onValueChange={setSize}
            minimumTrackTintColor="#1A1A1A"
            maximumTrackTintColor="#D8D2C4"
            thumbTintColor="#1A1A1A"
          />
          <Text style={styles.helper}>
            Preview stays compact. The PNG downloads at this resolution.
          </Text>

          <Text style={[styles.label, { marginTop: 20 }]}>
            Error correction
          </Text>
          <View style={styles.eclRow}>
            {ECL.map((e) => (
              <TouchableOpacity
                key={e.key}
                style={[
                  styles.eclChip,
                  ecl === e.key && styles.eclChipActive,
                ]}
                onPress={() => setEcl(e.key)}
              >
                <Text
                  style={[
                    styles.eclChipLabel,
                    ecl === e.key && styles.eclChipLabelActive,
                  ]}
                >
                  {e.label}
                </Text>
                <Text
                  style={[
                    styles.eclChipPct,
                    ecl === e.key && styles.eclChipLabelActive,
                  ]}
                >
                  {e.pct}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.helper}>
            {ecl === "H"
              ? "Most durable. Densest modules."
              : ecl === "L"
              ? "Least durable. Cleanest modules."
              : "Balanced durability and density."}
          </Text>
        </View>

        {/* Preview card */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.label}>Live preview</Text>
            <Text style={styles.meta}>
              {ECL.find((e) => e.key === ecl)?.label}
            </Text>
          </View>
          <View style={styles.previewFrame}>
            {content.trim().length === 0 ? (
              <Text style={styles.waiting}>Waiting for content</Text>
            ) : (
              <ViewShot
                ref={viewShotRef}
                options={{ format: "png", quality: 1 }}
                style={{
                  backgroundColor: bg,
                  padding: 16,
                  borderRadius: 8,
                }}
              >
                <QRCode
                  value={content}
                  size={Math.min(size, 260)}
                  color={fg}
                  backgroundColor={bg}
                  ecl={ecl}
                />
              </ViewShot>
            )}
          </View>
          <Text style={styles.helperCenter}>
            Ready · {size}×{size} PNG
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const CREAM = "#EDE9E1";
const CARD = "#F5F1E9";
const INK = "#1A1A1A";

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: CREAM },
  scroll: { padding: 20, paddingBottom: 60 },
  kicker: {
    fontSize: 11,
    letterSpacing: 2,
    color: "#8A8275",
    marginBottom: 6,
    fontWeight: "600",
  },
  title: {
    fontSize: 40,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    color: INK,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B6459",
    lineHeight: 20,
    marginBottom: 18,
  },
  downloadBtn: {
    backgroundColor: INK,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  downloadBtnText: { color: "#fff", fontWeight: "600", fontSize: 15 },
  card: {
    backgroundColor: CARD,
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: { fontSize: 14, fontWeight: "600", color: INK },
  smallLabel: { fontSize: 12, color: "#6B6459", marginBottom: 6 },
  meta: { fontSize: 12, color: "#9C9488" },
  input: {
    backgroundColor: "#FAF7F0",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E3DCCC",
    padding: 12,
    marginTop: 8,
    minHeight: 80,
    textAlignVertical: "top",
    fontSize: 14,
    color: INK,
  },
  colorRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 8,
    gap: 8,
  },
  swatchInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAF7F0",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E3DCCC",
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  swatch: { width: 20, height: 20, borderRadius: 4, marginRight: 8 },
  swatchText: { flex: 1, fontSize: 13, color: INK },
  swapBtn: {
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  presetRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  presetChip: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E3DCCC",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: "#FAF7F0",
  },
  presetChipActive: { borderColor: INK, borderWidth: 1.5 },
  presetIconWrap: {
    width: 16,
    height: 16,
    marginRight: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  presetIconTri: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderLeftColor: "transparent",
    borderBottomWidth: 14,
  },
  presetChipText: { fontSize: 12, color: INK },
  eclRow: { flexDirection: "row", gap: 8, marginTop: 8 },
  eclChip: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E3DCCC",
    backgroundColor: "#FAF7F0",
  },
  eclChipActive: { backgroundColor: INK, borderColor: INK },
  eclChipLabel: { fontSize: 13, color: INK, fontWeight: "500" },
  eclChipPct: { fontSize: 11, color: "#9C9488" },
  eclChipLabelActive: { color: "#fff" },
  helper: { fontSize: 12, color: "#9C9488", marginTop: 8 },
  helperCenter: {
    fontSize: 12,
    color: "#9C9488",
    marginTop: 10,
    textAlign: "center",
  },
  previewFrame: {
    backgroundColor: "#FAF7F0",
    borderRadius: 12,
    marginTop: 10,
    minHeight: 280,
    alignItems: "center",
    justifyContent: "center",
  },
  waiting: { color: "#9C9488", fontSize: 13 },
});

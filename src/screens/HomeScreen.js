import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import ViewShot from 'react-native-view-shot';
import Slider from '@react-native-community/slider';
import { colors, typography } from '../constants/theme';

const HomeScreen = () => {
  const [qrValue, setQrValue] = useState('https://example.com');
  const [qrSize, setQrSize] = useState(200);
  const qrRef = useRef();

  const handleGenerateQR = async () => {
    if (!qrValue.trim()) {
      Alert.alert('Error', 'Please enter a value for QR code');
      return;
    }
  };

  const handleDownloadQR = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Cannot access media library');
        return;
      }

      if (qrRef.current) {
        const uri = await qrRef.current.capture?.();
        if (uri) {
          await MediaLibrary.saveToLibraryAsync(uri);
          Alert.alert('Success', 'QR code saved to gallery');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save QR code: ' + error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Lattice QR</Text>
        <Text style={styles.subtitle}>Generate & Download QR Codes</Text>
      </View>

      <View style={styles.inputSection}>
        <Text style={styles.label}>Enter Text or URL</Text>
        <TextInput
          style={styles.input}
          placeholder="https://example.com"
          value={qrValue}
          onChangeText={setQrValue}
          placeholderTextColor={colors.gray}
        />
      </View>

      <View style={styles.sizeSection}>
        <Text style={styles.label}>QR Code Size: {qrSize}px</Text>
        <Slider
          style={styles.slider}
          minimumValue={100}
          maximumValue={400}
          value={qrSize}
          onValueChange={setQrSize}
          step={10}
        />
      </View>

      <View style={styles.qrContainer}>
        <ViewShot ref={qrRef} options={{ format: 'png', quality: 1 }}>
          <View style={styles.qrWrapper}>
            <QRCode
              value={qrValue}
              size={qrSize}
              color={colors.black}
              backgroundColor={colors.white}
            />
          </View>
        </ViewShot>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={handleGenerateQR}
        >
          <Text style={styles.buttonText}>Generate QR Code</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={handleDownloadQR}
        >
          <Text style={styles.buttonText}>Download QR Code</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.sizes.large,
    fontWeight: 'bold',
    color: colors.white,
  },
  subtitle: {
    fontSize: typography.sizes.small,
    color: colors.lightGray,
    marginTop: 8,
  },
  inputSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  label: {
    fontSize: typography.sizes.medium,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: typography.sizes.medium,
    color: colors.text,
    backgroundColor: colors.white,
  },
  sizeSection: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  slider: {
    height: 40,
    marginTop: 10,
  },
  qrContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  qrWrapper: {
    padding: 20,
    backgroundColor: colors.white,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 10,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
  },
  buttonText: {
    color: colors.white,
    fontSize: typography.sizes.medium,
    fontWeight: '600',
  },
});

export default HomeScreen;

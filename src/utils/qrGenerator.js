import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

export const saveQRToGallery = async (imageUri) => {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Media library permission not granted');
    }

    const asset = await MediaLibrary.createAssetAsync(imageUri);
    await MediaLibrary.createAlbumAsync('QR Codes', asset, false);
    return asset;
  } catch (error) {
    console.error('Error saving QR code:', error);
    throw error;
  }
};

export const generateQRFileName = () => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return `QR_${timestamp}.png`;
};

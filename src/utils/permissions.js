import * as MediaLibrary from 'expo-media-library';

export const requestMediaLibraryPermission = async () => {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Permission request error:', error);
    return false;
  }
};

export const requestFileSystemPermission = async () => {
  try {
    // File system permissions are handled by platform
    return true;
  } catch (error) {
    console.error('File system permission error:', error);
    return false;
  }
};

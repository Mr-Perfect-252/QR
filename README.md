# Lattice QR Code Generator

A React Native application for generating and downloading QR codes using Expo.

## Features

- Generate QR codes from text or URLs
- Adjust QR code size with a slider
- Download QR codes to device gallery
- Clean and intuitive UI
- Cross-platform support (Android/iOS)

## Project Structure

```
QR/
├── src/
│   ├── screens/
│   │   └── HomeScreen.js          # Main QR generation screen
│   ├── constants/
│   │   └── theme.js               # Colors, typography, spacing
│   └── utils/
│       ├── permissions.js          # Permission handling
│       └── qrGenerator.js          # QR generation utilities
├── android/                         # Android-specific resources
├── App.js                          # App entry point
├── app.json                        # Expo configuration
├── package.json                    # Dependencies
└── README.md                       # This file
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Development

Start the development server:
```bash
npm start
```

Run on Android:
```bash
npm run android
```

## Dependencies

- `expo` - Managed React Native framework
- `react-native-qrcode-svg` - QR code generation
- `react-native-view-shot` - Screenshot capture
- `expo-media-library` - Gallery access
- `expo-file-system` - File system operations
- `@react-native-community/slider` - Slider component

## Android Permissions

The app requires the following permissions:
- `READ_EXTERNAL_STORAGE` - Read from device storage
- `WRITE_EXTERNAL_STORAGE` - Write to device storage

## Building

For production builds, use Expo's build service:
```bash
expо build:android
```

## License

MIT

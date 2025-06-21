// screens/PaymentScreen.js
import React from 'react';
import { WebView } from 'react-native-webview';

export default function PaymentScreen() {
  return (
    <WebView source={{ uri: 'https://papaya-brigadeiros-3ac6ba.netlify.app/fee-payment' }} />
  );
}

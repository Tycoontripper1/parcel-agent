// ReceiptScreen.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from "react-native";
import { printToFileAsync } from "expo-print";
import * as Sharing from "expo-sharing";
import CustomView from "./CustomView";
import { MaterialIcons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackList, RootStackParamList } from "@/navigation/navigationType";

const generateHtmlReceipt = () => {
  const trxId = "2025070512191278645921";
  const sessionId = "090110250705122005493259983256";
  const amount = "5000.00";
  const fee = "50.00";
  const sender = "Ayo Musa - Wallet ID: W123456789";
  const receiver = "FCMB Savings - 1234567890 (John Doe)";
  const channel = "Bank Transfer";
    const total = `₦${(parseFloat(amount) + parseFloat(fee)).toLocaleString()}`;

  const date = new Date();
  const formattedDate = date.toLocaleString("en-NG", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Mask account numbers
  const maskAccountInfo = (info:any) => {
    const match = info.match(/(\d+)/);
    if (!match) return info;
    const num = match[0];
    return info.replace(num, `${num.slice(0, 3)}****${num.slice(-3)}`);
  };

  return `
    <html>
      <head>
        <style>
          body {
            font-family: 'Segoe UI', Roboto, sans-serif;
            background-color: #f8f9fa;
            padding: 0;
            margin: 0;
            color: #333;
          }
          .receipt-container {
            max-width: 400px;
            margin: 20px auto;
            background: white;
            border-radius: 16px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #6A0DAD 0%, #8A2BE2 100%);
            padding: 24px;
            text-align: center;
            color: white;
          }
          .logo {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 8px;
          }
          .status {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            font-size: 18px;
            font-weight: 600;
            margin: 16px 0;
          }
          .status-icon {
            font-size: 24px;
          }
          .content {
            padding: 24px;
          }
          .section {
            margin-bottom: 20px;
          }
          .section-title {
            font-size: 14px;
            color: #666;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .divider {
            height: 1px;
            background: #eee;
            margin: 16px 0;
          }
          .amount-display {
            text-align: center;
            margin: 24px 0;
          }
          .amount {
            font-size: 32px;
            font-weight: 700;
            color: #00A300;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
          }
          .detail-label {
            color: #666;
            font-weight: 500;
          }
          .detail-value {
            font-weight: 600;
            text-align: right;
            max-width: 60%;
          }
          .parties {
            display: flex;
            gap: 16px;
            margin: 24px 0;
          }
          .party {
            flex: 1;
          }
          .party-name {
            font-weight: 600;
            margin-bottom: 4px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .party-account {
            color: #666;
            font-size: 14px;
            font-family: monospace;
          }
          .footer {
            text-align: center;
            padding: 16px;
            color: #999;
            font-size: 14px;
            border-top: 1px dashed #ddd;
          }
        </style>
      </head>
      <body>
        <div class="receipt-container">
          <div class="header">
            <div class="logo">WishEvent</div>
            <div>Transaction Receipt</div>
          </div>

          <div class="content">
            <div class="status">
              <span class="status-icon">✓</span>
              Transfer Successful
            </div>

            <div class="amount-display">
              <div class="section-title">Amount Sent</div>
              <div class="amount">₦${parseFloat(amount).toLocaleString()}</div>
            </div>

            <div class="divider"></div>

            <div class="section">
              <div class="section-title">Transaction Details</div>
              <div class="detail-row">
                <span class="detail-label">Transaction ID:</span>
                <span class="detail-value">${trxId}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Date & Time:</span>
                <span class="detail-value">${formattedDate}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Channel:</span>
                <span class="detail-value">${channel}</span>
              </div>
            </div>

            <div class="divider"></div>

            <div class="section">
              <div class="section-title">Parties</div>
              <div class="parties">
                <div class="party">
                  <div class="section-title">From</div>
                  <div class="party-name">${sender.split('-')[0].trim()}</div>
                  <div class="party-account">${maskAccountInfo(sender)}</div>
                </div>
                <div style="align-self: center">→</div>
                <div class="party">
                  <div class="section-title">To</div>
                  <div class="party-name">${receiver.split('(')[0].trim()}</div>
                  <div class="party-account">${maskAccountInfo(receiver)}</div>
                </div>
              </div>
            </div>

            <div class="divider"></div>

            <div class="section">
              <div class="section-title">Payment Breakdown</div>
              <div class="detail-row">
                <span class="detail-label">Amount:</span>
                <span class="detail-value">₦${parseFloat(amount).toLocaleString()}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Fee:</span>
                <span class="detail-value">₦${parseFloat(fee).toLocaleString()}</span>
              </div>
              <div class="detail-row" style="margin-top: 8px;">
                <span class="detail-label" style="font-weight: 700;">Total:</span>
                <span class="detail-value" style="font-weight: 700;">${total}</span>
              </div>
            </div>
          </div>

          <div class="footer">
            Thank you for using WishEvent • ${new Date().getFullYear()}
          </div>
        </div>
      </body>
    </html>
  `;
};
type Props = NativeStackScreenProps<HomeStackList>;
type ReceiptScreenParams = {
  trxId: string;
  sessionId: string;
  amount: string;
  accountName?: string;
  bankName?: string;
  narration?: string;
  accountNumber?: string;
};

const ReceiptScreen = ({ navigation, route }: Props) => {
  const {
    trxId,
    sessionId,
    amount,
    accountName,
    bankName,
    narration,
    accountNumber,
  } = (route.params as ReceiptScreenParams) || {};
// const trxId = "2025070512191278645921";
// const trxId = "2025070512191278645921";
// const sessionId = "090110250705122005493259983256";
// const amount = "5000.00"; // in Naira
const fee = "50.00"; // Naira
const sender = "Ayo Musa - Wallet ID: W123456789";
const receiver = "FCMB Savings - 1234567890 (John Doe)";
const channel = "Bank Transfer";
  const handleDownload = async () => {
    try {
      const html = generateHtmlReceipt();
      const { uri } = await printToFileAsync({ html, base64: false });
      await Sharing.shareAsync(uri);
    } catch (err) {
      Alert.alert("Error", "Unable to create or share PDF");
    }
  };
  // Helper function to mask account numbers
const maskAccountNumber = (number:any) => {
  if (!number) return '';
  const first3 = number.slice(0, 3);
  const last3 = number.slice(-3);
  return `${first3}*****${last3}`;
};

  return (
    <CustomView style={styles.container}>
          <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.navigate('Dashboard')}
      >
        <MaterialIcons name="arrow-back" size={24} color="#00A300" />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
<ScrollView  showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Header with success icon */}
    <View style={styles.header}>
      <View style={styles.iconContainer}>
        <MaterialIcons name="check-circle" size={48} color="#00B900" />
      </View>
      <Text style={styles.title}>Transfer Successful</Text>
      <Text style={styles.subtitle}>Your transaction was completed successfully</Text>
    </View>

    {/* Transaction details card */}
    <View style={styles.card}>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Transaction ID</Text>
        <Text style={styles.value}>{trxId}</Text>
      </View>
      
      <View style={styles.separator} />
      
      <View style={styles.detailRow}>
        <Text style={styles.label}>Amount</Text>
        <Text style={[styles.value, styles.amount]}>₦{parseFloat(amount).toLocaleString()}</Text>
      </View>
      
      <View style={styles.detailRow}>
        <Text style={styles.label}>Fee</Text>
        <Text style={styles.value}>₦{parseFloat(fee).toLocaleString()}</Text>
      </View>
      
      <View style={styles.detailRow}>
        <Text style={[styles.label, styles.totalLabel]}>Total Debited</Text>
        <Text style={[styles.value, styles.totalValue]}>
          ₦{(parseFloat(amount) + parseFloat(fee)).toLocaleString()}
        </Text>
      </View>
    </View>

    {/* Parties information */}
<View style={styles.partiesContainer}>
  {/* Sender Card */}
  <View style={styles.partyCard}>
    <Text style={styles.sectionTitle}>From</Text>
    <View style={styles.accountContainer}>
      <Text 
        style={styles.partyName}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {accountName ? accountName.split('(')[0].trim() : ''}
      </Text>
      <Text style={styles.accountNumber}>
        {maskAccountNumber(accountNumber ? accountNumber.match(/\(([^)]+)\)/)?.[1] || '' : '')}
      </Text>
    </View>
  </View>
  
  {/* Arrow */}
  <View style={styles.arrowContainer}>
    <MaterialIcons name="arrow-forward" size={24} color="#666" />
  </View>
  
  {/* Receiver Card */}
  <View style={styles.partyCard}>
    <Text style={styles.sectionTitle}>To</Text>
    <View style={styles.accountContainer}>
      <Text 
        style={styles.partyName}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {receiver.split('(')[0].trim()}
      </Text>
      <Text style={styles.accountNumber}>
        {maskAccountNumber(receiver.match(/\(([^)]+)\)/)?.[1] || '')}
      </Text>
    </View>
  </View>
</View>

    {/* Additional details */}
    <View style={styles.card}>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Session ID</Text>
        <Text style={styles.value}>{sessionId}</Text>
      </View>
      
      <View style={styles.detailRow}>
        <Text style={styles.label}>Channel</Text>
        <Text style={styles.value}>{channel}</Text>
      </View>
      
      <View style={styles.detailRow}>
        <Text style={styles.label}>Date & Time</Text>
        <Text style={styles.value}>{new Date().toLocaleString()}</Text>
      </View>
    </View>

    {/* Action buttons */}
    <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
      <MaterialIcons name="picture-as-pdf" size={24} color="#fff" />
      <Text style={styles.downloadButtonText}>Download PDF Receipt</Text>
    </TouchableOpacity>
    
    <TouchableOpacity style={styles.shareButton}>
      <MaterialIcons name="share" size={24} color="#00A300" />
      <Text style={styles.shareButtonText}>Share Receipt</Text>
    </TouchableOpacity>

</ScrollView>
    </CustomView>
  );
};

export default ReceiptScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
    paddingHorizontal: RFValue(16),
    // backgroundColor: "#fff",
    // flex: 1,
  },
    backButton: {
    // position: 'absolute',
    // top: 50, // Adjust based on your status bar/header
    // right: 20,
    width: "100%",
    flexDirection: 'row',
    alignItems: "flex-end",
    zIndex: 10, // Ensures it stays above other elements
  },
  backButtonText: {
    color: '#00A300',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 5,
  },
   header: {
    alignItems: 'center',
    marginBottom: RFValue(10),
  },
  iconContainer: {
    backgroundColor: '#E8F7E8',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  partiesContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  partyCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    minHeight: 80,
    justifyContent: 'center',
  },
  accountContainer: {
    maxWidth: '90%',
  },
  partyName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  accountNumber: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'monospace',
  },
  arrowContainer: {
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: RFValue(10),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: RFValue(8),
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#00A300',
  },
  totalLabel: {
    fontWeight: '700',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  separator: {
    height: 1,
    backgroundColor: '#EEE',
    marginVertical: 4,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
    marginBottom: 8,
  },
  partyInfo: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  downloadButton: {
    flexDirection: 'row',
    backgroundColor: '#00A300',
    borderRadius: 8,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  downloadButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  shareButton: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#00A300',
    borderRadius: 8,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#00A300',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
});



// export default TransactionDetails;
import { View, Text, TouchableOpacity, StatusBar, StyleSheet, Alert, ScrollView } from 'react-native';
import React from 'react';
import BackButton from './share/BackButton';
import CustomView from './CustomView';
import { MaterialIcons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNavigation, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import CreditIcon from './svg/CreditIcon';
import DebitIcon from './svg/DebitIcon';
import HomeHeader from './share/HomeHeader';
import * as Clipboard from 'expo-clipboard';

const TransactionDetails = () => {
  const route = useRoute();
const { transaction } = (route.params || {}) as { transaction?: any };

  const navigation = useNavigation();

  // Format date to "Mar 3, 2025" format
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch {
      return "Invalid date";
    }
  };
  
  // Format time to "12:30 PM" format
  const formatTime = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "h:mm a");
    } catch {
      return "Invalid time";
    }
  };

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
    Alert.alert("Copied", "Reference ID copied to clipboard");
  };

  const getTransactionTitle = () => {
    const accountName = transaction.accountName || "unknown account";
    const shortenedName = accountName.length > 10 
      ? `${accountName.slice(0, 10)}...` 
      : accountName;

    if (transaction.direction === "debit") {
      return `Transfer to ${shortenedName}`;
    } else {
      return `Transfer from ${shortenedName}`;
    }
  };

  return (
    <CustomView style={detailStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <HomeHeader type='Stack' title='Transaction Details' />
      
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 16}}>
        <View style={detailStyles.amountContainer}>
             <View style={[
          detailStyles.iconContainer,
          { backgroundColor: transaction.type === "credit" ? "#E6FFDB" : "#E6FFDB" }
        ]}>
          <Text style={detailStyles.logoText}>𝓹</Text>
        </View>
        
        <Text style={[
          detailStyles.amountText,
          transaction.direction === "credit" ? detailStyles.creditAmount : detailStyles.debitAmount
        ]}>
          {transaction.direction === "credit" ? "+" : "-"}₦{parseFloat(transaction.amount).toLocaleString()}
        </Text>
        
        <Text style={detailStyles.transactionTitle}>{getTransactionTitle()}</Text>
        <Text style={detailStyles.transactionStatus}>
          Status: <Text style={[
            transaction.status === "successful" 
              ? detailStyles.successText 
              : transaction.status === "pending"
                ? detailStyles.pendingText
                : detailStyles.failedText
          ]}>
            {transaction.status || "Successful"}
          </Text>
        </Text>
      </View>
      
      <View style={detailStyles.detailsCard}>
        <DetailRow label="Description" value={transaction.narration || "N/A"} />
        <DetailRow label="Date" value={formatDate(transaction.createdAt)} />
        <DetailRow label="Time" value={formatTime(transaction.createdAt)} />
        <DetailRow 
          label="Reference ID" 
          value={transaction.reference || "N/A"} 
          copyable 
          onCopy={() => copyToClipboard(transaction.reference)}
        />
        <DetailRow 
          label={transaction.direction === "credit" ? "From" : "To"} 
          value={transaction.accountName || "N/A"} 
        />
        <DetailRow 
          label="Account Number" 
          value={transaction.accountNumber || "N/A"} 
        />
        {transaction.trxId && (
          <DetailRow label="Transaction ID" value={transaction.trxId} />
        )}
      </View>
      
      {/* Conditional Buttons */}
      <View style={detailStyles.buttonContainer}>
        <TouchableOpacity 
          style={[detailStyles.actionButton, detailStyles.shareButton]}
          onPress={() => Alert.alert("Share", "Receipt sharing functionality would go here")}
        >
          <Text style={detailStyles.shareButtonText}>Share Receipt</Text>
        </TouchableOpacity>
        
        {transaction.direction === "debit" && (
          <TouchableOpacity 
            style={[detailStyles.actionButton, detailStyles.reportButton]}
            onPress={() => Alert.alert("Report", "Transaction reporting functionality would go here")}
          >
            <Text style={detailStyles.reportButtonText}>Report</Text>
          </TouchableOpacity>
        )}
      </View>
      </ScrollView>
    </CustomView>
  );
};

// Reusable Detail Row Component
const DetailRow = ({ label, value, copyable = false, onCopy }: any) => (
  <View style={detailStyles.detailRow}>
    <Text style={detailStyles.detailLabel}>{label}</Text>
    <View style={detailStyles.detailValueContainer}>
      <Text style={detailStyles.detailValue} numberOfLines={1} ellipsizeMode="tail">
        {value}
      </Text>
      {copyable && (
        <TouchableOpacity style={detailStyles.copyButton} onPress={onCopy}>
          <MaterialIcons name="content-copy" size={16} color="#12B76A" />
        </TouchableOpacity>
      )}
    </View>
  </View>
);

const detailStyles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: RFValue(16), 
    backgroundColor: "#fff" 
  },
   logoText: {
    fontSize: RFValue(40),
    fontWeight: "700",
    fontFamily: "Arial", // Consider using a custom font here
    color: "#213264",
   },
  amountContainer: {
    alignItems: "center",
    marginBottom: RFValue(32),
  },
  iconContainer: {
    width: RFValue(54),
    height: RFValue(54),
    borderRadius: RFValue(32),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: RFValue(16),
  },
  amountText: {
    fontSize: RFValue(24),
    fontWeight: "700",
    marginBottom: RFValue(8),
  },
  creditAmount: { color: "#12B76A" },
  debitAmount: { color: "#F04438" },
  transactionTitle: {
    fontSize: RFValue(18),
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: RFValue(4),
    textAlign: "center",
    maxWidth: "80%",
  },
  transactionStatus: {
    fontSize: RFValue(14),
    color: "#64748B",
  },
  successText: { color: "#12B76A" },
  pendingText: { color: "#F79009" },
  failedText: { color: "#12B76A" },
  detailsCard: {
    backgroundColor: "#F8F9FA",
    borderRadius: RFValue(16),
    padding: RFValue(16),
    marginBottom: RFValue(24),
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: RFValue(12),
    borderBottomWidth: 1,
    borderColor: "#F1F5F9",
  },
  detailLabel: {
    fontSize: RFValue(14),
    color: "#64748B",
    flex: 1,
  },
  detailValueContainer: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  detailValue: {
    fontSize: RFValue(14),
    fontWeight: "500",
    color: "#0F172A",
    textAlign: "right",
  },
  copyButton: {
    marginLeft: RFValue(8),
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    marginBottom: RFValue(16),
    justifyContent: "space-between",
    gap: RFValue(12),
  },
  actionButton: {
    borderRadius: RFValue(8),
    padding: RFValue(16),
    alignItems: "center",
    flex: 1,
  },
  shareButton: {
    backgroundColor: "#12B76A",
  },
  reportButton: {
    backgroundColor: "#FEE4E2",
  },
  shareButtonText: {
    color: "#fff",
    fontSize: RFValue(14),
    fontWeight: "600",
  },
  reportButtonText: {
    color: "#F04438",
    fontSize: RFValue(14),
    fontWeight: "600",
  },
});

export default TransactionDetails;
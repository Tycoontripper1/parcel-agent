import React from "react";
import { View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import Text from "./Text";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import ArrowRight from "./svg/ArrowRight";

const { width } = Dimensions.get("window");

export interface IAccountButton {
  label: string;
  url?: string;
  desc: string
  icon?: React.ReactNode;
}

interface IAccountButtonSection {
  heading: string;
  buttons: IAccountButton[];
}

interface AccountButtonsProps {
  sections: IAccountButtonSection[];
}

const AccountButton = ({ sections }: AccountButtonsProps) => {
  const navigation = useNavigation();
  return (
    <View style={styles.parcelButtonsContainer}>
      {sections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={{ marginBottom: 10 }}>
          <Text size={12} font="Bold" color="#A4A7AE" style={{ marginBottom: 10 }}>
            {section.heading}
          </Text>

          {section.buttons.map((button, buttonIndex) => (
                  <TouchableOpacity
       onPress={() => {
         if (button.url) {
           navigation.navigate("AccountStack", {
             screen: button.url as never,
           });
         }
       }}
       key={buttonIndex}
       style={{ marginBottom: 10 }} // Adds space between buttons
     >
       <View
         style={{
           width: "100%",
           paddingHorizontal: 20,
           paddingVertical: 20,
           flexDirection: "row",
           alignItems: "center",
           justifyContent: "space-between",
           backgroundColor: "white",
           borderWidth: 0,
           borderRadius: 10,
         }}
       >
    <View style={{flexDirection:"row", gap: 6, alignItems:"center"}}>
         <View>{button.icon}</View>
    <View
           style={{
             flexDirection: "column",
             alignItems: "flex-start",
             gap: 5, // Adds space between label and desc
           }}
         >
           <Text size={12} font="Medium" style={{ marginBottom: 5 }}>
             {button.label}
           </Text>
           <Text size={10} font="Medium" color="#717680">
             {button.desc}
           </Text>
         </View>
    </View>
     
         <ArrowRight color="" />
       </View>
     </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};


const styles = StyleSheet.create({
  parcelButtonsContainer: {
    flexDirection: "column",
    // flexWrap: "wrap",
    gap: 10,
    padding: RFValue(8),
    borderRadius: RFValue(8),
  },
  parcelText: {
    fontSize: RFValue(14),
  },
  parcelLabel: {
    fontSize: RFValue(14),
  },
});

export default AccountButton;

import { ReportStackList } from "@/navigation/navigationType";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import HomeShipmentHistory from "./HomeShipementHistory";

type HomeShipmentHistoryScreenProps = NativeStackScreenProps<ReportStackList, 'HomeShipmentHistory'>;

export const HomeShipmentHistoryScreen = ({ navigation, route }: HomeShipmentHistoryScreenProps) => {
  // You must either pass `searchQuery`, `limit`, `onViewAll` via route.params OR fetch it inside
  const { searchQuery, onViewAll, limit } = route.params;

  const handleViewAll = (item: any) => {
    navigation.navigate("UnAssignParcelDetails", { item });
  };
  return (
    <HomeShipmentHistory
      searchQuery={searchQuery}
      onViewAll={onViewAll}
        handleViewAll={handleViewAll}
      limit={limit}
      
    />
  );
};

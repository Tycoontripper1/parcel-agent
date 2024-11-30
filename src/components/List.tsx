import React from 'react';
import {FlatList, View, StyleSheet} from 'react-native';
import {useTheme} from '@/hooks/useTheme'; // Adjust the import path
import Text from './Text'; // Use your custom Text component
import {RFValue} from 'react-native-responsive-fontsize';

interface ListItemProps {
  id: string;
  title: string;
  description?: string;
}

interface ListProps {
  data: ListItemProps[];
  renderItem?: (item: ListItemProps) => JSX.Element;
}

const List = ({data, renderItem}: ListProps) => {
  const {theme} = useTheme(); // Get the current theme

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({item}) =>
        renderItem ? (
          renderItem(item)
        ) : (
          <DefaultListItem
            title={item.title}
            description={item.description}
            id={item.id}
          />
        )
      }
      contentContainerStyle={[
        styles.listContainer,
        {backgroundColor: theme.background}, // Theme-aware background
      ]}
    />
  );
};

const DefaultListItem = ({title, description}: ListItemProps) => {
  return (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flexGrow: 1,
  },
  item: {
    padding: RFValue(16),
    borderBottomWidth: 1,
  },
  title: {
    fontSize: RFValue(16),
    fontWeight: '600',
  },
  description: {
    fontSize: RFValue(14),
  },
});

export default List;

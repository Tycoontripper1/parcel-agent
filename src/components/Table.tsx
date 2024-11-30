import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {useTheme} from '@/hooks/useTheme'; // Hook to access the app theme
import {RFValue} from 'react-native-responsive-fontsize';

interface TableProps {
  /** Headers of the table */
  headers: string[];

  /** Rows of the table */
  data: Array<string[]>;
}

const Table = ({headers, data}: TableProps) => {
  const {theme} = useTheme(); // Get the current theme (light or dark)

  return (
    <ScrollView horizontal>
      <View>
        {/* Render Table Headers */}
        <View style={[styles.row, {backgroundColor: theme.headerBackground}]}>
          {headers.map((header, index) => (
            <Text
              key={index}
              style={[
                styles.cell,
                styles.header,
                {color: theme.headerText, borderColor: theme.border},
              ]}>
              {header}
            </Text>
          ))}
        </View>

        {/* Render Table Rows */}
        {data.map((row, rowIndex) => (
          <View
            key={rowIndex}
            style={[
              styles.row,
              {
                backgroundColor:
                  rowIndex % 2 === 0
                    ? theme.rowBackground
                    : theme.alternateRowBackground, // Alternate row colors
              },
            ]}>
            {row.map((cell, cellIndex) => (
              <Text
                key={cellIndex}
                style={[
                  styles.cell,
                  {color: theme.text, borderColor: theme.border},
                ]}>
                {cell}
              </Text>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    padding: RFValue(10),
    borderWidth: 1,
    fontSize: RFValue(14),
  },
  header: {
    fontWeight: 'bold',
    fontSize: RFValue(16),
  },
});

export default Table;

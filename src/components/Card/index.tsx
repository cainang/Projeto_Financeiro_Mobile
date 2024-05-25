import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Income from '../../assets/income.svg';
import Expense from '../../assets/expense.svg';
import Total from '../../assets/total.svg';
import { colors } from '../../utils/colors';

type CardProps = {
  title: string;
  value: string;
  type: 'entrada' | 'saida' | 'total';
};

function Card(props: CardProps): React.JSX.Element {
  const handleIcon = () => {
    if (props.type === 'entrada') {
      return <Income width={32} height={32} />;
    } else if (props.type === 'saida') {
      return <Expense width={32} height={32} />;
    } else {
      return <Total width={32} height={32} />;
    }
  }

  const getBackgroundColor = () => {
    if (props.type === 'total') {
      return colors.primary;
    } else {
      return colors.secondary;
    }
  }

  const getTextStyle = () => {
    if (props.type === 'total') {
      return styles.valueGreen;
    } else {
      return styles.valueBlack;
    }
  }

  return (
    <View style={[styles.card, { backgroundColor: getBackgroundColor() }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, getTextStyle()]}>{props.title}</Text>
        {handleIcon()}
      </View>
      <Text style={[styles.value, getTextStyle()]}>{props.value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 28,
    width: '90%',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 18,
    color: '#000',
  },
  value: {
    fontSize: 32,
    lineHeight: 48,
    marginTop: 16,
  },
  valueBlack: {
    color: '#000',
  },
  valueGreen: {
    color: '#fff',
  },
});

export default Card;

import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, Text, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, ProgressBar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';

import Header from '../components/Header';
import CategoryIcon from '../components/CategoryIcon';
import { useCategories } from '../hooks/useCategories';
import { formatCurrency } from '../lib/formatters';

type NavigationProp = StackNavigationProp<RootStackParamList>;

// This would be fetched from an API in a real app
const mockBudgets = [
  { id: 1, categoryId: 1, categoryName: 'Food & Drinks', icon: 'utensils', color: '#FF5722', amount: 500, spent: 350 },
  { id: 2, categoryId: 2, categoryName: 'Shopping', icon: 'shopping-bag', color: '#9C27B0', amount: 300, spent: 275 },
  { id: 3, categoryId: 3, categoryName: 'Transport', icon: 'map', color: '#2196F3', amount: 200, spent: 80 },
  { id: 4, categoryId: 4, categoryName: 'Home', icon: 'home', color: '#4CAF50', amount: 1000, spent: 1000 },
  { id: 5, categoryId: 5, categoryName: 'Entertainment', icon: 'film', color: '#FF9800', amount: 150, spent: 120 },
];

interface BudgetItemProps {
  item: {
    id: number;
    categoryId: number;
    categoryName: string;
    icon: string;
    color: string;
    amount: number;
    spent: number;
  };
  onEdit: (id: number) => void;
}

function BudgetItem({ item, onEdit }: BudgetItemProps) {
  const progress = item.spent / item.amount;
  const isOverBudget = item.spent > item.amount;
  
  return (
    <Card style={styles.budgetCard}>
      <View style={styles.budgetHeader}>
        <View style={styles.categoryInfo}>
          <CategoryIcon name={item.icon} color={item.color} size={16} />
          <Text style={styles.categoryName}>{item.categoryName}</Text>
        </View>
        <TouchableOpacity onPress={() => onEdit(item.id)}>
          <MaterialCommunityIcons name="pencil" size={18} color="#666" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.budgetAmounts}>
        <Text style={styles.spentText}>
          Spent: <Text style={isOverBudget ? styles.overBudgetText : undefined}>{formatCurrency(item.spent)}</Text>
        </Text>
        <Text style={styles.budgetText}>
          Budget: {formatCurrency(item.amount)}
        </Text>
      </View>
      
      <ProgressBar 
        progress={Math.min(progress, 1)} 
        color={isOverBudget ? '#F44336' : '#4CAF50'} 
        style={styles.progressBar}
      />
      
      <Text style={[styles.remainingText, isOverBudget && styles.overBudgetText]}>
        {isOverBudget 
          ? `Over budget by ${formatCurrency(item.spent - item.amount)}` 
          : `${formatCurrency(item.amount - item.spent)} remaining`
        }
      </Text>
    </Card>
  );
}

export default function BudgetScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { data: categories } = useCategories('expense');
  
  const [editingBudgetId, setEditingBudgetId] = useState<number | null>(null);
  
  const handleEditBudget = (id: number) => {
    setEditingBudgetId(id);
    // In a real app, this would open a modal or navigate to an edit screen
    alert(`Editing budget ${id}`);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Monthly Budgets</Text>
          <TouchableOpacity style={styles.addButton}>
            <MaterialCommunityIcons name="plus" size={20} color="white" />
            <Text style={styles.addButtonText}>Add Budget</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={mockBudgets}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <BudgetItem 
              item={item} 
              onEdit={handleEditBudget} 
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '500',
    marginLeft: 4,
  },
  listContent: {
    paddingBottom: 20,
  },
  budgetCard: {
    marginBottom: 12,
    padding: 16,
    borderRadius: 8,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryName: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  budgetAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  spentText: {
    fontSize: 14,
    color: '#666',
  },
  budgetText: {
    fontSize: 14,
    color: '#666',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 8,
  },
  remainingText: {
    fontSize: 14,
    color: '#4CAF50',
    textAlign: 'right',
    fontWeight: '500',
  },
  overBudgetText: {
    color: '#F44336',
  },
});
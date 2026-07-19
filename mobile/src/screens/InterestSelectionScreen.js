import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const interestsList = [
  { id: 'tech', label: 'Technology', icon: 'laptop-outline', color: '#7C3AED' },
  { id: 'gov', label: 'Government', icon: 'business-outline', color: '#3B82F6' },
  { id: 'ai', label: 'AI', icon: 'hardware-chip-outline', color: '#EC4899' },
  { id: 'news', label: 'News', icon: 'newspaper-outline', color: '#EF4444' },
  { id: 'edu', label: 'Education', icon: 'book-outline', color: '#10B981' },
  { id: 'health', label: 'Health', icon: 'heart-outline', color: '#F43F5E' },
  { id: 'travel', label: 'Travel', icon: 'airplane-outline', color: '#06B6D4' },
  { id: 'sports', label: 'Sports', icon: 'football-outline', color: '#F59E0B' },
  { id: 'finance', label: 'Finance', icon: 'cash-outline', color: '#8B5CF6' },
  { id: 'agri', label: 'Agriculture', icon: 'leaf-outline', color: '#10B981' },
  { id: 'business', label: 'Business', icon: 'trending-up-outline', color: '#3B82F6' },
  { id: 'ent', label: 'Entertainment', icon: 'film-outline', color: '#EC4899' },
];

export default function InterestSelectionScreen({ onBack, onFinish }) {
  const [selectedIds, setSelectedIds] = useState([]);

  const toggleInterest = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Choose your interests</Text>
        <Text style={styles.subtitle}>Select a few topics you are passionate about</Text>
      </View>

      {/* Grid List */}
      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        {interestsList.map((item) => {
          const isSelected = selectedIds.includes(item.id);
          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.card,
                isSelected && styles.cardSelected,
                { borderColor: isSelected ? item.color : '#E5E7EB' }
              ]}
              onPress={() => toggleInterest(item.id)}
            >
              {isSelected ? (
                <LinearGradient
                  colors={[item.color, item.color + 'DD']}
                  style={styles.cardGradient}
                >
                  <Ionicons name={item.icon} size={28} color="#FFFFFF" />
                  <Text style={styles.labelSelected}>{item.label}</Text>
                  <View style={styles.checkBadge}>
                    <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
                  </View>
                </LinearGradient>
              ) : (
                <View style={styles.cardContent}>
                  <View style={[styles.iconBg, { backgroundColor: item.color + '15' }]}>
                    <Ionicons name={item.icon} size={24} color={item.color} />
                  </View>
                  <Text style={styles.label}>{item.label}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Footer Area */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.finishButton} onPress={onFinish}>
          <LinearGradient
            colors={['#7C3AED', '#F97316']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <Text style={styles.finishText}>Finish</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        <Text style={styles.footerText}>You can update later in settings</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 40,
  },
  header: {
    height: 48,
    justifyContent: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  titleContainer: {
    marginVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    marginTop: 4,
    lineHeight: 22,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  card: {
    width: '48%',
    height: 100,
    borderRadius: 16,
    borderWidth: 1.5,
    marginBottom: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  cardSelected: {
    borderWidth: 0,
    elevation: 4,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  cardGradient: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cardContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#374151',
  },
  labelSelected: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
  },
  checkBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  footer: {
    marginTop: 10,
    alignItems: 'center',
  },
  finishButton: {
    width: '100%',
    height: 54,
    borderRadius: 27,
    overflow: 'hidden',
    marginBottom: 12,
  },
  gradientButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  finishText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});

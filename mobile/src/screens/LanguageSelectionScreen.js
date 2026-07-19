import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const languagesList = [
  { id: 'en', name: 'English', subtitle: 'Default', initials: 'EN' },
  { id: 'ta', name: 'தமிழ்', subtitle: 'Tamil', initials: 'த' },
  { id: 'hi', name: 'हिन्दी', subtitle: 'Hindi', initials: 'हि' },
  { id: 'te', name: 'తెలుగు', subtitle: 'Telugu', initials: 'తె' },
  { id: 'kn', name: 'ಕನ್ನಡ', subtitle: 'Kannada', initials: 'ಕ' },
  { id: 'ml', name: 'മലയാളം', subtitle: 'Malayalam', initials: 'മ' },
];

export default function LanguageSelectionScreen({ onBack, onContinue }) {
  const [selectedId, setSelectedId] = useState('en');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLanguages = languagesList.filter(lang => 
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    lang.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContinue = () => {
    const selected = languagesList.find(l => l.id === selectedId);
    onContinue(selected);
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
        <Text style={styles.title}>Choose your language</Text>
        <Text style={styles.subtitle}>Select your preferred language</Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search language"
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Languages List */}
      <FlatList
        data={filteredLanguages}
        keyExtractor={(item) => item.id}
        style={styles.list}
        renderItem={({ item }) => {
          const isSelected = item.id === selectedId;
          return (
            <TouchableOpacity 
              style={[styles.languageItem, isSelected && styles.languageItemActive]} 
              onPress={() => setSelectedId(item.id)}
            >
              <View style={styles.langInfo}>
                {/* Visual Avatar block with initials */}
                <View style={styles.langAvatar}>
                  <Text style={styles.langAvatarText}>{item.initials}</Text>
                </View>
                <View style={styles.langTextContainer}>
                  <Text style={styles.langName}>{item.name}</Text>
                  <Text style={styles.langSub}>{item.subtitle}</Text>
                </View>
              </View>
              <View style={[styles.radio, isSelected && styles.radioActive]}>
                {isSelected && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* Action Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <ImageBackground
            source={require('../../assets/image.png')}
            style={styles.gradientButton}
            resizeMode="cover"
          >
            <Text style={styles.continueText}>Continue</Text>
          </ImageBackground>
        </TouchableOpacity>
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
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 52,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    marginVertical: 16,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1F2937',
  },
  list: {
    flex: 1,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    borderRadius: 8,
    marginBottom: 8,
  },
  languageItemActive: {
    backgroundColor: '#F5F3FF',
  },
  langInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  langAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF2F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  langAvatarText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6B7280',
  },
  langTextContainer: {
    justifyContent: 'center',
  },
  langName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  langSub: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 2,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioActive: {
    borderColor: '#7C3AED',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#7C3AED',
  },
  footer: {
    marginTop: 16,
  },
  continueButton: {
    width: '100%',
    height: 54,
    borderRadius: 27,
    overflow: 'hidden',
  },
  gradientButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

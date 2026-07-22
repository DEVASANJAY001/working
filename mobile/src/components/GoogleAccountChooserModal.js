import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const GOOGLE_ACCOUNTS = [
  {
    name: 'deva Sanjay',
    email: 'devasanjay14@gmail.com',
    avatar: 'https://lh3.googleusercontent.com/a/default-user',
    initials: 'D',
    bgColor: '#3B82F6',
  },
  {
    name: 'davns',
    email: 'davnspvtltd@gmail.com',
    avatar: null,
    initials: 'D',
    bgColor: '#6B7280',
  },
  {
    name: 'devasanjay natarajan',
    email: 'devasanjaynatarajan@gmail.com',
    avatar: null,
    initials: 'D',
    bgColor: '#2563EB',
  },
  {
    name: 'Kiranbalaji H',
    email: 'kiranbalajih@gmail.com',
    avatar: null,
    initials: 'K',
    bgColor: '#9333EA',
  },
  {
    name: 'DEVILS HORN E-SPORTS',
    email: 'pubgesport4@gmail.com',
    avatar: null,
    initials: 'DH',
    bgColor: '#10B981',
  },
  {
    name: 'Natarajan Tv',
    email: 'xiaomitvdeva2468@gmail.com',
    avatar: null,
    initials: 'N',
    bgColor: '#EF4444',
  },
  {
    name: 'Aviator',
    email: 'aviator.god.in@gmail.com',
    avatar: null,
    initials: 'A',
    bgColor: '#EA580C',
  },
  {
    name: 'DEVASANJAY',
    email: 'devasanjay.student@saveetha.ac.in',
    avatar: null,
    initials: 'D',
    bgColor: '#0EA5E9',
  },
  {
    name: 'devasanjay',
    email: 'devasanjay.wp79@gmail.com',
    avatar: null,
    initials: 'D',
    bgColor: '#F59E0B',
  },
  {
    name: 'davns',
    email: 'davnsindustries@gmail.com',
    avatar: null,
    initials: 'D',
    bgColor: '#4B5563',
  },
];

export default function GoogleAccountChooserModal({ visible, onClose, onSelectAccount }) {
  if (!visible) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <View style={styles.sheetContainer}>
          {/* Top Pill Icon */}
          <View style={styles.logoHeader}>
            <View style={styles.appIconBox}>
              <Text style={styles.appIconLetter}>S</Text>
            </View>
            <Text style={styles.headerTitle}>Choose an account</Text>
            <Text style={styles.headerSubtitle}>to continue to Split</Text>
          </View>

          {/* Accounts List */}
          <ScrollView 
            style={styles.accountsList}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {GOOGLE_ACCOUNTS.map((acc, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.accountRow}
                activeOpacity={0.7}
                onPress={() => onSelectAccount(acc)}
              >
                <View style={[styles.avatarCircle, { backgroundColor: acc.bgColor }]}>
                  <Text style={styles.avatarText}>{acc.initials}</Text>
                </View>

                <View style={styles.accountInfo}>
                  <Text style={styles.accountName}>{acc.name}</Text>
                  <Text style={styles.accountEmail}>{acc.email}</Text>
                </View>
              </TouchableOpacity>
            ))}

            {/* Add another account */}
            <TouchableOpacity 
              style={styles.accountRow}
              activeOpacity={0.7}
              onPress={() => onSelectAccount(GOOGLE_ACCOUNTS[0])}
            >
              <View style={styles.addAccountIconCircle}>
                <Ionicons name="person-add-outline" size={20} color="#E5E7EB" />
              </View>
              <View style={styles.accountInfo}>
                <Text style={styles.addAccountText}>Add another account</Text>
              </View>
            </TouchableOpacity>

            <Text style={styles.footerDisclaimer}>
              To continue, Google will share your name, email address, and profile picture with Split.
            </Text>
          </ScrollView>

          {/* Bottom gesture line */}
          <View style={styles.homeIndicator} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  sheetContainer: {
    maxHeight: '90%',
    backgroundColor: '#2D2D2D',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  logoHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  appIconBox: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: '#1E1B4B',
    borderWidth: 1,
    borderColor: '#3730A3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  appIconLetter: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '400',
    color: '#E5E7EB',
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  accountsList: {
    width: '100%',
  },
  scrollContent: {
    paddingBottom: 10,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#404040',
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  addAccountIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: '#404040',
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#E5E7EB',
  },
  accountEmail: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 2,
  },
  addAccountText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#E5E7EB',
  },
  footerDisclaimer: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 24,
    marginBottom: 10,
    lineHeight: 18,
    textAlign: 'left',
  },
  homeIndicator: {
    width: 134,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#E5E7EB',
    alignSelf: 'center',
    marginTop: 10,
  },
});

import { Feather } from '@expo/vector-icons'
import React from 'react'
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native'
import HotWalletInfo from './HotWalletInfo'

export interface LoginCredentials {
  email: string
  password: string
}

interface OnboardingModalProps {
  isVisible: boolean
  onClose: () => void
}

interface Styles {
  modalContainer: ViewStyle
  overlay: ViewStyle
  modalContent: ViewStyle
  headerContainer: ViewStyle
  closeButton: ViewStyle
  card: ViewStyle
  scrollViewContent: ViewStyle
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isVisible, onClose }) => {
  const handleClose = (): void => {
    onClose()
  }

  return (
    <Modal visible={isVisible} transparent animationType="slide" onRequestClose={handleClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalContainer}>
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>

        <View style={styles.modalContent}>
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Feather name="x" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
            <View style={styles.card}>
              <HotWalletInfo />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create<Styles>({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#f5f6fa',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  headerContainer: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  closeButton: {
    padding: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingTop: 8,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
})

export default OnboardingModal

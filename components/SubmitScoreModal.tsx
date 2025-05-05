import { ThemedText } from '@/components/ThemedText';
import React from 'react';
import { Modal, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';

interface SubmitScoreModalProps {
    visible: boolean;
    onCancel: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    cancelButtonText?: string;
    confirmButtonText?: string;
}

const SubmitScoreModalNotVisible: React.FC<SubmitScoreModalProps> = ({
    visible,
    onCancel,
    onConfirm,
    title = 'Confirm Transaction',
    message = 'Are you sure you want to send this transaction?',
    cancelButtonText = 'Cancel',
    confirmButtonText = 'Confirm',
}) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onCancel}
            supportedOrientations={['portrait', 'landscape-right']}
        >
            <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPress={onCancel}>
                <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
                    <ThemedText style={styles.modalTitle}>{title}</ThemedText>
                    <ThemedText style={styles.modalMessage}>{message}</ThemedText>
                    <View style={styles.buttonContainer}>
                        <Pressable style={[styles.button, styles.cancelButton]} onPress={onCancel}>
                            <ThemedText style={styles.cancelButtonText}>{cancelButtonText}</ThemedText>
                        </Pressable>
                        <Pressable style={[styles.button, styles.confirmButton]} onPress={onConfirm}>
                            <ThemedText style={styles.confirmButtonText}>{confirmButtonText}</ThemedText>
                        </Pressable>
                    </View>
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 24,
        borderRadius: 16,
        width: '85%',
        maxWidth: 400,
        minWidth: 280,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 16,
        textAlign: 'center',
    },
    modalMessage: {
        fontSize: 16,
        marginBottom: 24,
        textAlign: 'center',
        color: '#666',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    confirmButton: {
        backgroundColor: '#007AFF',
    },
    cancelButton: {
        backgroundColor: '#F2F2F2',
    },
    confirmButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    cancelButtonText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default SubmitScoreModalNotVisible;

import React from 'react'
import { Modal, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { ThemedText } from '@/components/ThemedText'

const ShortenedPrivacyPolicy = ({
    isVisible,
    onClose,
}: {
    isVisible: boolean
    onClose: () => void
}) => {
    return (
        <Modal visible={isVisible} transparent animationType="slide" onRequestClose={onClose}>
            <View style={styles.policyModalContainer}>
                <View style={styles.policyModalContent}>
                    <View style={styles.policyHeaderContainer}>
                        <ThemedText style={styles.policyTitle}>Privacy Policy</ThemedText>
                        <TouchableOpacity onPress={onClose} style={styles.policyCloseButton}>
                            <Feather name="x" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.policyScrollView}>
                        <ThemedText style={styles.policyText}>
                            This Privacy Policy describes how your personal information is collected, used, and shared when you use our mobile application ("App"), provided by [INSERT COMPANY NAME].

                            1. Information We Collect
                            When you use the App, we may collect the following information:

                            Personal information: such as your name, email, and phone number (if provided).
                            Usage information: data about how you interact with the App, features accessed, and duration of use.
                            Device information: device model, operating system, language, and App version.
                            Location: if you allow it, we may collect your approximate location.

                            2. How We Use Your Information
                            The information we collect may be used to:
                            - Provide and maintain the functionality of the App;
                            - Personalize your user experience;
                            - Improve the performance and functionality of the App;
                            - Contact you if necessary;
                            - Comply with legal and regulatory obligations.

                            3. Sharing of Information
                            We do not share your personal information with third parties, except:
                            - With service providers who help us operate the App, under confidentiality agreements;
                            - When required by law or by competent authorities;
                            - In case of a merger, acquisition, or sale of assets, your information may be transferred to the new owners.

                            4. Security
                            We implement technical and organizational measures to protect your information against unauthorized access, alteration, disclosure, or destruction.

                            5. Data Retention
                            We retain your information only for as long as necessary to fulfill the purposes described in this policy, unless otherwise required by legal obligations.

                            6. Your Rights
                            At any time, you may:
                            - Request access to the personal information we hold about you;
                            - Correct incorrect or outdated information;
                            - Request deletion of your data;
                            - Withdraw previously given consents.
                            To exercise your rights, please contact us at [INSERT CONTACT EMAIL OR CHANNEL].

                            7. Children
                            Our App is not directed at children under 13 years of age. We do not knowingly collect personal information from children. If we learn that we have collected such data, we will take appropriate steps to delete it.

                            8. Changes to This Policy
                            We may update this Privacy Policy from time to time. You will be notified of any significant changes through the App or by another appropriate channel.

                            9. Contact
                            If you have any questions about this Privacy Policy or how we handle your information, please contact:
                            [INSERT COMPANY NAME]
                            [INSERT ADDRESS]
                            [INSERT CONTACT EMAIL]
                        </ThemedText>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    policyModalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 20,
    },
    policyModalContent: {
        backgroundColor: '#fff',
        borderRadius: 16,
        maxHeight: '80%',
        padding: 0,
    },
    policyHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e1e1e1',
    },
    policyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    policyCloseButton: {
        padding: 4,
    },
    policyScrollView: {
        padding: 16,
    },
    policyText: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
    },
});

export default ShortenedPrivacyPolicy;
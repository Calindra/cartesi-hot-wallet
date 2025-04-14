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
                        </ThemedText>

                        <ThemedText style={styles.policyText}>
                            1. Information We Collect{'\n'}
                            When you use the App, we may collect the following information:{'\n\n'}
                            • Personal information: such as your name, email, and phone number (if provided).{'\n'}
                            • Usage information: data about how you interact with the App, features accessed, and duration of use.{'\n'}
                            • Device information: device model, operating system, language, and App version.{'\n'}
                            • Location: if you allow it, we may collect your approximate location.
                        </ThemedText>

                        <ThemedText style={styles.policyText}>
                            2. How We Use Your Information{'\n'}
                            The information we collect may be used to:{'\n'}
                            • Provide and maintain the functionality of the App;{'\n'}
                            • Personalize your user experience;{'\n'}
                            • Improve the performance and functionality of the App;{'\n'}
                            • Contact you if necessary;{'\n'}
                            • Comply with legal and regulatory obligations.
                        </ThemedText>

                        <ThemedText style={styles.policyText}>
                            3. Sharing of Information{'\n'}
                            We do not share your personal information with third parties, except:{'\n'}
                            • With service providers who help us operate the App, under confidentiality agreements;{'\n'}
                            • When required by law or by competent authorities;{'\n'}
                            • In case of a merger, acquisition, or sale of assets, your information may be transferred to the new owners.
                        </ThemedText>

                        <ThemedText style={styles.policyText}>
                            4. Security{'\n'}
                            We implement technical and organizational measures to protect your information against unauthorized access, alteration, disclosure, or destruction.
                        </ThemedText>

                        <ThemedText style={styles.policyText}>
                            5. Data Retention{'\n'}
                            We retain your information only for as long as necessary to fulfill the purposes described in this policy, unless otherwise required by legal obligations.
                        </ThemedText>

                        <ThemedText style={styles.policyText}>
                            6. Your Rights{'\n'}
                            At any time, you may:{'\n'}
                            • Request access to the personal information we hold about you;{'\n'}
                            • Correct incorrect or outdated information;{'\n'}
                            • Request deletion of your data;{'\n'}
                            • Withdraw previously given consents.{'\n\n'}
                            To exercise your rights, please contact us at [INSERT CONTACT EMAIL OR CHANNEL].
                        </ThemedText>

                        <ThemedText style={styles.policyText}>
                            7. Children{'\n'}
                            Our App is not directed at children under 13 years of age. We do not knowingly collect personal information from children. If we learn that we have collected such data, we will take appropriate steps to delete it.
                        </ThemedText>

                        <ThemedText style={styles.policyText}>
                            8. Changes to This Policy{'\n'}
                            We may update this Privacy Policy from time to time. You will be notified of any significant changes through the App or by another appropriate channel.
                        </ThemedText>

                        <ThemedText style={styles.policyText}>
                            9. Contact{'\n'}
                            If you have any questions about this Privacy Policy or how we handle your information, please contact:{'\n\n'}
                            [INSERT COMPANY NAME]{'\n'}
                            [INSERT ADDRESS]{'\n'}
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
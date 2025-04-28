import { Feather } from '@expo/vector-icons';
import * as Sentry from '@sentry/react-native';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    TextStyle,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    ViewStyle,
} from 'react-native';
import { ThemedText } from '../ThemedText';

interface Styles {
    modalContainer: ViewStyle;
    overlay: ViewStyle;
    modalContent: ViewStyle;
    headerContainer: ViewStyle;
    closeButton: ViewStyle;
    card: ViewStyle;
    userIcon: ViewStyle;
    title: TextStyle;
    signupContainer: ViewStyle;
    signupText: TextStyle;
    agreeButton: ViewStyle;
    agreeButtonText: TextStyle;
}

interface PrivacyPolicyProps {
    onClose: () => void;
    onAccept?: () => void; // Callback opcional que será chamado quando o usuário aceitar
    shouldCheckPriorAgreement?: boolean; // Controla se deve verificar aceitação prévia
}
interface PrivacyPolicyComponent extends React.FC<PrivacyPolicyProps> {
    hasUserAgreed: () => Promise<boolean>;
    resetAgreement: () => Promise<void>;
}

const PRIVACY_POLICY_STORAGE_KEY = 'PrivacyPolicyAgreement';

const PrivacyPolicy: PrivacyPolicyComponent = ({ onClose, onAccept, shouldCheckPriorAgreement = true }) => {
    const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Verifica se o usuário já aceitou a política anteriormente
        if (shouldCheckPriorAgreement) {
            checkPriorAgreement();
        }
    }, [shouldCheckPriorAgreement]);

    const checkPriorAgreement = async () => {
        try {
            const storedValue = await SecureStore.getItemAsync(PRIVACY_POLICY_STORAGE_KEY);
            if (storedValue === 'true') {
                // Se já aceitou, fecha o modal automaticamente
                handleClose();

                // Notifica que houve aceitação (mesmo que prévia)
                if (onAccept) {
                    onAccept();
                }
            }
        } catch (e) {
            Sentry.captureException(e, {
                // user: { id: '123', email: 'test1@example.com' }, // context info about user
                tags: { feature: 'checkPriorAgreement' },
                extra: { debugData: '@privacyPolicy.tsx - Error checking prior agreement' },
                // fingerprint: ['custom-fingerprint'],
            });
            console.error('Error checking privacy policy agreement:', e);
        }
    };

    const savePrivacyPolicyAgreement = async () => {
        try {
            await SecureStore.setItemAsync(PRIVACY_POLICY_STORAGE_KEY, 'true');
            console.log('Privacy policy agreement saved successfully');

            // Notifica sobre a aceitação
            if (onAccept) {
                onAccept();
            }

            handleClose();
        } catch (e) {
            Sentry.captureException(e, {
                // user: { id: '123', email: 'test1@example.com' }, // context info about user
                tags: { feature: 'savePrivacyPolicyAgreement' },
                extra: { debugData: '@privacyPolicy.tsx - Error saving privacy policy agreement' },
                // fingerprint: ['custom-fingerprint'],
            });
            console.error('Error saving privacy policy agreement:', e);
        }
    };

    const handleClose = () => {
        setIsVisible(false);
        onClose();
    };

    const handleScroll = (event: any) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        const isAtBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

        if (isAtBottom && !hasScrolledToEnd) {
            setHasScrolledToEnd(true);
        }
    };

    // Se o modal não estiver visível, não renderiza nada
    if (!isVisible) {
        return null;
    }

    const PrivacyPolicyContent = `This Privacy Policy describes how your personal information is collected, used, and shared when you use our mobile application ("App"), provided by [INSERT COMPANY NAME].

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
`;

    return (
        <Modal transparent animationType="slide" visible={isVisible}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalContainer}>
                <TouchableWithoutFeedback>
                    <View style={styles.overlay} />
                </TouchableWithoutFeedback>

                <View style={styles.modalContent}>
                    <View style={styles.headerContainer}>{/* Você pode adicionar um botão de fechar aqui se quiser */}</View>

                    <View style={styles.card}>
                        <Feather name="user" size={32} color="#4a90e2" style={styles.userIcon as any} />
                        <ThemedText style={styles.title}>Privacy Policy</ThemedText>
                        <View style={{ flex: 1 }}>
                            <ScrollView onScroll={handleScroll} scrollEventThrottle={100} showsVerticalScrollIndicator>
                                <View style={styles.signupContainer}>
                                    <ThemedText style={styles.signupText}>{PrivacyPolicyContent}</ThemedText>
                                </View>
                            </ScrollView>
                        </View>
                        <TouchableOpacity
                            style={[styles.agreeButton, { opacity: hasScrolledToEnd ? 1 : 0.5 }]}
                            onPress={savePrivacyPolicyAgreement}
                            disabled={!hasScrolledToEnd}
                        >
                            <ThemedText style={styles.agreeButtonText}>I Agree</ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

// Método estático que pode ser chamado sem instanciar o componente
PrivacyPolicy.hasUserAgreed = async (): Promise<boolean> => {
    try {
        const storedValue = await SecureStore.getItemAsync(PRIVACY_POLICY_STORAGE_KEY);
        return storedValue === 'true';
    } catch (e) {
        Sentry.captureException(e, {
            // user: { id: '123', email: 'test1@example.com' }, // context info about user
            tags: { feature: 'hasUserAgreed' },
            extra: { debugData: '@privacyPolicy.tsx - Error checking privacy policy agreement' },
            // fingerprint: ['custom-fingerprint'],
        });
        console.error('Error checking privacy policy agreement:', e);
        return false;
    }
};

// Método estático para resetar o acordo (útil para testes ou para forçar mostrar o modal novamente)
PrivacyPolicy.resetAgreement = async (): Promise<void> => {
    try {
        await SecureStore.deleteItemAsync(PRIVACY_POLICY_STORAGE_KEY);
        console.log('Privacy policy agreement reset successfully');
    } catch (e) {
        Sentry.captureException(e, {
            // user: { id: '123', email: 'test1@example.com' }, // context info about user
            tags: { feature: 'resetAgreement' },
            extra: { debugData: '@privacyPolicy.tsx - Error resetting privacy policy agreement' },
            // fingerprint: ['custom-fingerprint'],
        });
        console.error('Error resetting privacy policy agreement:', e);
    }
};

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
        // maxHeight: '90%',
        flex: 1,
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
        flexGrow: 1,
        flex: 1,
    },
    userIcon: {
        alignSelf: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#1a1a1a',
        marginBottom: 8,
    },
    signupContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        paddingBottom: 16,
    },
    signupText: {
        color: '#000',
        fontSize: 14,
        textAlign: 'left',
        lineHeight: 20,
    },
    agreeButton: {
        marginTop: 16,
        backgroundColor: '#4a90e2',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    agreeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default PrivacyPolicy;

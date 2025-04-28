import ShortenedPrivacyPolicy from '@/components/PrivacyPolicy/ShortennedPrivacyPolicy';
import { ThemedText } from '@/components/ThemedText';
import { Feather } from '@expo/vector-icons';
import * as Sentry from '@sentry/react-native';
import { Stack, router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Animated, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { formatTimeToCrack, getPasswordStrengthInfo, validateEmail, validatePassword } from '../utils/createAccountUtils';

interface CreateAccountPageProps {
    onBack: () => void;
}

export default function CreateAccountPage({ onBack }: CreateAccountPageProps) {
    // State variables remain unchanged
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false);
    const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

    const buttonScale = new Animated.Value(1);

    const handleBack = () => {
        router.back();
    };

    const getPasswordStrength = () => {
        const { score } = validatePassword(password);
        return getPasswordStrengthInfo(score);
    };

    const handleButtonPress = () => {
        Animated.sequence([
            Animated.timing(buttonScale, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(buttonScale, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
    };

    async function savePassword() {
        handleButtonPress();

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (!privacyPolicyAccepted) {
            setError('You must accept the Privacy Policy to continue');
            return;
        }
        if (!validateEmail(email)) {
            setError('Please enter a valid email');
            return;
        }

        const { score, timeToCrack } = validatePassword(password);
        if (score < 3) {
            setError(`Please enter a stronger password.\nThat password could be cracked in ${formatTimeToCrack(timeToCrack)}`);
            return;
        }

        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            Alert.alert('Success', 'Account created successfully!');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setPrivacyPolicyAccepted(false);
            setError('');
        } catch (e) {
            Sentry.captureException(error, {
                // user: { id: '123', email: 'test1@example.com' }, // context info about user
                tags: { feature: 'savePassword' },
                extra: { debugData: '@createAccount.tsx - Error saving password' },
                // fingerprint: ['custom-fingerprint'],
            });
            Alert.alert('Error', 'Failed to create account');
        } finally {
            setIsLoading(false);
        }
    }

    const strength = getPasswordStrength();

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.container}>
                {/* Fixed header */}
                <View style={styles.stickyHeader}>
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <Feather name="arrow-left" size={24} color="#4a90e2" />
                    </TouchableOpacity>
                </View>

                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardAvoidingView}>
                    <ScrollView contentContainerStyle={styles.scrollContainer} bounces={false}>
                        <Feather name="lock" size={32} color="#4a90e2" style={styles.lockIcon} />
                        <ThemedText style={styles.title}>Create Account</ThemedText>
                        <ThemedText style={styles.subtitle}>Choose a strong password to secure your account</ThemedText>

                        {/* Rest of the form remains unchanged */}
                        <View style={styles.inputContainer}>
                            <View style={styles.inputIconContainer}>
                                <Feather name="mail" size={20} color="#666" />
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                value={email}
                                onChangeText={setEmail}
                                placeholderTextColor="#999"
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <View style={styles.inputIconContainer}>
                                <Feather name="lock" size={20} color="#666" />
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter password"
                                secureTextEntry={!showPassword}
                                value={password}
                                onChangeText={setPassword}
                                placeholderTextColor="#999"
                            />
                            <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
                                <Feather name={showPassword ? 'eye-off' : 'eye'} size={20} color="#666" />
                            </TouchableOpacity>
                        </View>

                        {password && (
                            <View style={styles.strengthContainer}>
                                <View style={[styles.strengthBar, { backgroundColor: strength.color }]} />
                                <ThemedText style={[styles.strengthText, { color: strength.color }]}>{strength.text}</ThemedText>
                            </View>
                        )}

                        <View style={styles.inputContainer}>
                            <View style={styles.inputIconContainer}>
                                <Feather name="lock" size={20} color="#666" />
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="Confirm password"
                                secureTextEntry={!showConfirmPassword}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                placeholderTextColor="#999"
                            />
                            <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                <Feather name={showConfirmPassword ? 'eye-off' : 'eye'} size={20} color="#666" />
                            </TouchableOpacity>
                        </View>

                        {error ? (
                            <View style={styles.errorContainer}>
                                <Feather name="x-circle" size={16} color="#ff4d4d" />
                                <ThemedText style={styles.error}>{error}</ThemedText>
                            </View>
                        ) : null}

                        <View style={styles.requirementsList}>
                            <ThemedText style={styles.requirementsTitle}>Password Requirements:</ThemedText>
                            <View style={styles.requirementItem}>
                                <Feather name="check-circle" size={16} color={password.length >= 6 ? '#2ecc71' : '#ccc'} />
                                <ThemedText style={styles.requirementText}>At least 6 characters</ThemedText>
                            </View>
                            <View style={styles.requirementItem}>
                                <Feather name="check-circle" size={16} color={/\d/.test(password) ? '#2ecc71' : '#ccc'} />
                                <ThemedText style={styles.requirementText}>Contains a number</ThemedText>
                            </View>
                            <View style={styles.requirementItem}>
                                <Feather
                                    name="check-circle"
                                    size={16}
                                    color={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? '#2ecc71' : '#ccc'}
                                />
                                <ThemedText style={styles.requirementText}>Contains a special character</ThemedText>
                            </View>
                        </View>

                        <View style={styles.privacyContainer}>
                            <TouchableOpacity style={styles.checkbox} onPress={() => setPrivacyPolicyAccepted(!privacyPolicyAccepted)}>
                                {privacyPolicyAccepted ? (
                                    <Feather name="check-square" size={20} color="#4a90e2" />
                                ) : (
                                    <Feather name="square" size={20} color="#666" />
                                )}
                            </TouchableOpacity>
                            <View style={styles.privacyTextContainer}>
                                <ThemedText style={styles.privacyText}>
                                    I accept the{' '}
                                    <ThemedText style={styles.privacyLink} onPress={() => setShowPrivacyPolicy(true)}>
                                        Privacy Policy
                                    </ThemedText>
                                </ThemedText>
                            </View>
                        </View>

                        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                            <TouchableOpacity
                                style={[styles.button, (isLoading || !privacyPolicyAccepted) && styles.buttonDisabled]}
                                onPress={savePassword}
                                disabled={isLoading || !privacyPolicyAccepted}
                            >
                                <ThemedText style={styles.buttonText}>{isLoading ? 'Creating Account...' : 'Create Account'}</ThemedText>
                            </TouchableOpacity>
                        </Animated.View>
                    </ScrollView>

                    <ShortenedPrivacyPolicy isVisible={showPrivacyPolicy} onClose={() => setShowPrivacyPolicy(false)} />
                </KeyboardAvoidingView>
            </View>
        </>
    );
}

const HEADER_HEIGHT = Platform.OS === 'ios' ? 90 : 80;

const styles = StyleSheet.create({
    // Styles remain unchanged
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 24,
        paddingTop: HEADER_HEIGHT + 24,
    },
    lockIcon: {
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
    subtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
    },
    stickyHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: HEADER_HEIGHT,
        backgroundColor: '#fff',
        paddingHorizontal: 24,
        justifyContent: 'center',
        zIndex: 1000,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingTop: Platform.OS === 'ios' ? 50 : 30,
    },
    backButton: {
        padding: 8,
        marginLeft: -8, // Offset the padding
    },
    inputContainer: {
        position: 'relative',
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputIconContainer: {
        position: 'absolute',
        left: 16,
        zIndex: 1,
    },
    input: {
        flex: 1,
        height: 56,
        borderWidth: 1.5,
        borderColor: '#e1e1e1',
        borderRadius: 12,
        paddingHorizontal: 48,
        fontSize: 16,
        color: '#1a1a1a',
        backgroundColor: '#fff',
    },
    eyeIcon: {
        position: 'absolute',
        right: 16,
        top: 18,
    },
    strengthContainer: {
        marginBottom: 16,
    },
    strengthBar: {
        height: 4,
        borderRadius: 2,
        marginBottom: 4,
    },
    strengthText: {
        fontSize: 12,
        textAlign: 'right',
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        padding: 12,
        backgroundColor: '#fff5f5',
        borderRadius: 8,
    },
    error: {
        color: '#ff4d4d',
        marginLeft: 8,
        fontSize: 14,
    },
    requirementsList: {
        marginBottom: 24,
    },
    requirementsTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginBottom: 12,
    },
    requirementItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    requirementText: {
        marginLeft: 8,
        color: '#666',
        fontSize: 14,
    },
    button: {
        backgroundColor: '#4a90e2',
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#a0c5e8',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    privacyContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    checkbox: {
        marginRight: 8,
        padding: 2,
    },
    privacyTextContainer: {
        flex: 1,
    },
    privacyText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    privacyLink: {
        color: '#4a90e2',
        textDecorationLine: 'underline',
    },
});

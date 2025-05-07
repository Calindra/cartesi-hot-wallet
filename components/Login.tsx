import LoginContext from '@/hooks/loginContext';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
    Animated,
    Keyboard,
    LayoutChangeEvent,
    Linking,
    Modal,
    ScrollView,
    StyleSheet,
    TextInput,
    TextStyle,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    ViewStyle,
} from 'react-native';
import zxcvbn from 'zxcvbn';
import { ThemedText } from './ThemedText';

export interface LoginCredentials {
    email: string;
    password: string;
}

interface LoginModalProps {
    isVisible: boolean;
    onClose: () => void;
    onLogin: (credentials: LoginCredentials) => Promise<void>;
    setShowCreateAccount: () => void;
}

interface Styles {
    modalContainer: ViewStyle;
    overlay: ViewStyle;
    modalContent: ViewStyle;
    headerContainer: ViewStyle;
    closeButton: ViewStyle;
    card: ViewStyle;
    userIcon: TextStyle;
    title: TextStyle;
    subtitle: TextStyle;
    inputContainer: ViewStyle;
    inputIconContainer: ViewStyle;
    input: TextStyle;
    eyeIcon: ViewStyle;
    errorContainer: ViewStyle;
    error: TextStyle;
    button: ViewStyle;
    buttonDisabled: ViewStyle;
    buttonText: TextStyle;
    signupContainer: ViewStyle;
    signupText: TextStyle;
    signupLink: TextStyle;
}

const LoginModal: React.FC<LoginModalProps> = ({ isVisible, onClose, onLogin }) => {
    const { email, setEmail } = useContext(LoginContext);
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const router = useRouter();

    const scrollRef = useRef<ScrollView>(null);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [emailY, setEmailY] = useState(0);
    const [passwordY, setPasswordY] = useState(0);

    useEffect(() => {
        const showSub = Keyboard.addListener('keyboardDidShow', e => {
            setKeyboardHeight(e.endCoordinates.height);
        });
        const hideSub = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardHeight(0);
        });
        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);

    const buttonScale = useRef(new Animated.Value(1)).current;

    const handleButtonPress = (): void => {
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

    const handleClose = (): void => {
        setPassword('');
        setError('');
        onClose();
    };

    const handleSignUp = (): void => {
        handleClose();
        router.push('/createAccount');
    };

    const handlePrivacyPolicyPress = async () => {
        const url = 'https://cartesi-hot-wallet-project.fly.dev/privacy-policy.html';
        const supported = await Linking.canOpenURL(url);

        if (supported) {
            await Linking.openURL(url);
        } else {
            console.warn(`Don't know how to open this URL: ${url}`);
        }
    };

    const validateEmail = (email: string): boolean => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validatePassword = (password: string): { passWordStrengthScore: number; timeToCrack: string | number } => {
        const { score, crack_times_seconds } = zxcvbn(password);
        return { passWordStrengthScore: score, timeToCrack: crack_times_seconds.offline_slow_hashing_1e4_per_second };
    };

    const handleLogin = async (): Promise<void> => {
        handleButtonPress();
        setError('');

        if (!email.trim()) {
            setError('Please enter your email');
            return;
        }
        if (!validateEmail(email)) {
            setError('Please enter a valid email');
            return;
        }
        if (!password) {
            setError('Please enter your password');
            return;
        }

        const { passWordStrengthScore, timeToCrack } = validatePassword(password);
        if (passWordStrengthScore < 3) {
            setError(`Please enter a stronger password.\nThat password would take ${timeToCrack}s to be broken`);
            return;
        }

        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            await onLogin({ email, password });
            handleClose();
        } catch {
            setError('Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            visible={isVisible}
            transparent
            animationType="slide"
            onRequestClose={handleClose}
            supportedOrientations={['landscape', 'landscape-right']}
        >
            <TouchableWithoutFeedback onPress={handleClose}>
                <View style={styles.overlay} />
            </TouchableWithoutFeedback>

            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <ScrollView
                        ref={scrollRef}
                        contentContainerStyle={{ flexGrow: 1, paddingBottom: keyboardHeight }}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={styles.headerContainer}>
                            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                                <Feather name="x" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.card}>
                            <Feather name="user" size={32} color="#4a90e2" style={styles.userIcon} />
                            <ThemedText style={styles.title}>Welcome</ThemedText>
                            <ThemedText style={styles.subtitle}>Sign in to your account</ThemedText>

                            <View style={styles.inputContainer} onLayout={(e: LayoutChangeEvent) => setEmailY(e.nativeEvent.layout.y)}>
                                <View style={styles.inputIconContainer}>
                                    <Feather name="mail" size={20} color="#666" />
                                </View>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Email"
                                    placeholderTextColor="#999"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={email}
                                    onChangeText={setEmail}
                                    onFocus={() => scrollRef.current?.scrollTo({ y: emailY - 20, animated: true })}
                                />
                            </View>

                            <View style={styles.inputContainer} onLayout={(e: LayoutChangeEvent) => setPasswordY(e.nativeEvent.layout.y)}>
                                <View style={styles.inputIconContainer}>
                                    <Feather name="lock" size={20} color="#666" />
                                </View>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Password"
                                    placeholderTextColor="#999"
                                    secureTextEntry={!showPassword}
                                    value={password}
                                    onChangeText={setPassword}
                                    onFocus={() => scrollRef.current?.scrollTo({ y: passwordY - 20, animated: true })}
                                />
                                <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
                                    <Feather name={showPassword ? 'eye-off' : 'eye'} size={20} color="#666" />
                                </TouchableOpacity>
                            </View>

                            {error ? (
                                <View style={styles.errorContainer}>
                                    <Feather name="alert-circle" size={16} color="#ff4d4d" />
                                    <ThemedText style={styles.error}>{error}</ThemedText>
                                </View>
                            ) : null}

                            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                                <TouchableOpacity
                                    style={[styles.button, isLoading && styles.buttonDisabled]}
                                    onPress={handleLogin}
                                    disabled={isLoading}
                                >
                                    <ThemedText style={styles.buttonText}>{isLoading ? 'Signing in...' : 'Sign In'}</ThemedText>
                                </TouchableOpacity>
                            </Animated.View>

                            <View style={styles.signupContainer}>
                                <ThemedText style={styles.signupText}>Don't have an account? </ThemedText>
                                <TouchableOpacity onPress={handleSignUp}>
                                    <ThemedText style={styles.signupLink}>Sign Up</ThemedText>
                                </TouchableOpacity>
                                <ThemedText>-</ThemedText>
                                <TouchableOpacity onPress={handlePrivacyPolicyPress}>
                                    <ThemedText style={styles.signupLink}>Privacy Policy</ThemedText>
                                </TouchableOpacity>
                                {/* https://cartesi-hot-wallet-project.fly.dev/privacy-policy.html */}
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create<Styles>({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '75%',
        width: '100%',
        position: 'absolute',
        bottom: 0,
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
    subtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
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
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
        gap: 8,
    },
    signupText: {
        color: '#666',
        fontSize: 14,
    },
    signupLink: {
        color: '#4a90e2',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default LoginModal;

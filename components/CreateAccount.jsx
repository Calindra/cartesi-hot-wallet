import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  StyleSheet, 
  Animated,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback
} from "react-native";
import { Feather } from '@expo/vector-icons';

const CreateAccount = ({ isVisible, onClose, onSave }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const buttonScale = new Animated.Value(1);

  const validatePassword = (pass) => {
    const hasMinLength = pass.length >= 6;
    const hasNumber = /\d/.test(pass);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    return { hasMinLength, hasNumber, hasSpecial };
  };

  const getPasswordStrength = () => {
    const validation = validatePassword(password);
    const score = Object.values(validation).filter(Boolean).length;
    if (score === 0) return { color: "#ff4d4d", text: "Weak" };
    if (score === 1) return { color: "#ffd700", text: "Fair" };
    if (score === 2) return { color: "#2ecc71", text: "Good" };
    return { color: "#27ae60", text: "Strong" };
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

  const handleClose = () => {
    setPassword("");
    setConfirmPassword("");
    setError("");
    onClose();
  };

  async function savePassword() {
    handleButtonPress();
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      // Simulated delay for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (onSave) {
        await onSave(password);
      }
      Alert.alert("Success", "Password saved securely!");
      handleClose();
    } catch (e) {
      Alert.alert("Error", "Failed to save password");
    } finally {
      setIsLoading(false);
    }
  }

  const strength = getPasswordStrength();

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalContainer}
      >
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>

        <View style={styles.modalContent}>
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Feather name="x" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Feather name="lock" size={32} color="#4a90e2" style={styles.lockIcon} />
            <Text style={styles.title}>Create Password</Text>
            <Text style={styles.subtitle}>Choose a strong password to secure your account</Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter password"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                placeholderTextColor="#999"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Feather 
                  name={showPassword ? "eye-off" : "eye"} 
                  size={20} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>

            {password && (
              <View style={styles.strengthContainer}>
                <View style={[styles.strengthBar, { backgroundColor: strength.color }]} />
                <Text style={[styles.strengthText, { color: strength.color }]}>
                  {strength.text}
                </Text>
              </View>
            )}

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Confirm password"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholderTextColor="#999"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Feather 
                  name={showConfirmPassword ? "eye-off" : "eye"} 
                  size={20} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>

            {error ? (
              <View style={styles.errorContainer}>
                <Feather name="x-circle" size={16} color="#ff4d4d" />
                <Text style={styles.error}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.requirementsList}>
              <Text style={styles.requirementsTitle}>Password Requirements:</Text>
              <View style={styles.requirementItem}>
                <Feather 
                  name="check-circle" 
                  size={16} 
                  color={password.length >= 6 ? "#2ecc71" : "#ccc"} 
                />
                <Text style={styles.requirementText}>At least 6 characters</Text>
              </View>
              <View style={styles.requirementItem}>
                <Feather 
                  name="check-circle" 
                  size={16} 
                  color={/\d/.test(password) ? "#2ecc71" : "#ccc"} 
                />
                <Text style={styles.requirementText}>Contains a number</Text>
              </View>
              <View style={styles.requirementItem}>
                <Feather 
                  name="check-circle" 
                  size={16} 
                  color={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? "#2ecc71" : "#ccc"} 
                />
                <Text style={styles.requirementText}>Contains a special character</Text>
              </View>
            </View>

            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <TouchableOpacity
                style={[styles.button, isLoading && styles.buttonDisabled]}
                onPress={savePassword}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? "Saving..." : "Save Password"}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end", // This makes the modal slide up from the bottom
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: "#f5f6fa",
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
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingTop: 8,
  },
  lockIcon: {
    alignSelf: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  inputContainer: {
    position: "relative",
    marginBottom: 16,
  },
  input: {
    height: 56,
    borderWidth: 1.5,
    borderColor: "#e1e1e1",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#1a1a1a",
    backgroundColor: "#fff",
  },
  eyeIcon: {
    position: "absolute",
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
    textAlign: "right",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#fff5f5",
    borderRadius: 8,
  },
  error: {
    color: "#ff4d4d",
    marginLeft: 8,
    fontSize: 14,
  },
  requirementsList: {
    marginBottom: 24,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 12,
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  requirementText: {
    marginLeft: 8,
    color: "#666",
    fontSize: 14,
  },
  button: {
    backgroundColor: "#4a90e2",
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#a0c5e8",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CreateAccount;
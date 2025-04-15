import React, { useEffect, useState } from 'react'
import { Modal, View, TouchableOpacity, ActivityIndicator } from 'react-native'
import { WebView } from 'react-native-webview'
import { ThemedText } from './ThemedText'
import { generateLeaderboardHTML } from '@/src/services/LeaderboardServices'

export default function LeaderboardModal({ visible, onClose }: any) {
    const [html, setHtml] = useState<string | null>(null)

    useEffect(() => {
        if (visible) {
            generateLeaderboardHTML().then(setHtml)
        }
    }, [visible])

    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
            <View style={{ flex: 1 }}>
                <TouchableOpacity onPress={onClose} style={{ padding: 10 }}>
                    <ThemedText style={{ color: '#E44' }}>Close</ThemedText>
                </TouchableOpacity>
                {html ? (
                    <WebView originWhitelist={['*']} source={{ html }} />
                ) : (
                    <ActivityIndicator style={{ marginTop: 40 }} size="large" />
                )}
            </View>
        </Modal>
    )
}

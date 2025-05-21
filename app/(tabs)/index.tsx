import CustomGrid from '@/components/CustomGrid/CustomGrid';
import ParallaxScrollViewWithWallet from '@/components/ParallaxScrollViewWithWallet';
import { GameData } from '@/src/model/GameData';
import * as NavigationBar from 'expo-navigation-bar';
import { usePathname } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, Platform, ScrollView, StyleSheet } from 'react-native';
const logo = require('../../assets/images/banner-cartesi-app-1920x1920px.jpg');

// TODO: could come from an API
const gameData: GameData[] = [
    {
        id: '1',
        title: 'Joy',
        author: 'Calindra',
        imageUrl: 'https://i.imgur.com/FePyexY.jpeg',
        gameURL: 'https://raw.githubusercontent.com/edubart/cartridges/main/gamepad.sqfs',
        webviewURI: 'https://rives-virtual-mobile-gamepad.vercel.app/doom-with-arrows.html',
        webview: false,
        tiltGamepad: 'doom-smooth-turn.html',
        arrowGamepad: 'doom-with-arrows.html',
    },
    {
        id: '2',
        title: 'Free Doom',
        author: 'Dude',
        imageUrl: 'https://rives.io/img/carts/freedoom.png',
        // gameURL: 'https://mainnet-v5.rives.io/data/cartridges/721f735bbca3',
        gameURL: 'https://ipfs.io/ipfs/bafybeicrcve7x2nzwewuwy4ixdgddfvtif4jlzingbejydw5ekfawk2ycu/721f735bbca3',
        webview: false,
        webviewURI: 'https://rives-virtual-mobile-gamepad.vercel.app/doom-with-arrows.html',
        tiltGamepad: 'doom-smooth-turn.html',
        arrowGamepad: 'doom-with-arrows.html',
    },
    {
        id: '3',
        title: 'Rives Raid',
        author: 'Alberto Sousa',
        imageUrl:
            'data:image/jpeg;base64,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',
        gameURL: 'https://mainnet-v5.rives.io/data/cartridges/40b0cb5ee306',
        webview: false,
        webviewURI: 'https://rives-virtual-mobile-gamepad.vercel.app/doom-with-arrows.html',
        tiltGamepad: 'doom-smooth-turn.html',
        arrowGamepad: 'doom-with-arrows.html',
    },
    {
        id: '4',
        title: 'Slalom',
        author: 'Danilo Tuler',
        imageUrl:
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAMAAABrrFhUAAAAUVBMVEUAAAD////Fzdtoa3IYFCU1NliLl7Ze6ekokNwYMacFMjkAX0EIsjtH9kHo/3X7voI3PcGxKSdHcyLSUFA9lzyycnFkkzV9gL+Vylm6urnS0tGwGu1IAAAEbUlEQVR4nO2d0XabMBBE0z/oSV+S/v+HJsTBBlsSO2IRy+zcl7j2CLwXAW4rb97+JOcNShMiAVCaEAmA0oRIAJQmRAKgtNtef3c7/Xy7A2zA8a1Aabe9SsD65/PjgUgAlHbbqwSsfz4/HshZAh4XvqQXweQC7nv/EQANcX8LUNp97xIgARKgi2BmAQGQAChNiARAaUIkAErv2tPiTnd7XHtmem7Y+xo7A5Z7ey10foZcwP2YpxPQPAVurxaeP/xdQWmvvT32WjspyE+BlAKqd4GfJ58nP+kMCIgEQGlCJABKEyIBUJoQCYDShEgAlCZEAqA0IWEE/PsGGuCEBEDpw5jKP0dBCAFz+UkFPMo/Q0EIAbOE2+OxSACU3sHfb8qvLKf/Q0A978sgAVM59YJez/923pMhAm7ltAU8H30iAXM5LQHLD0LbeU/CzIDlKRBYwPs7FL9jEWDPezJIQPuqXroBhhWwR0HtlfIngIACpvIlQAL6L4S1V9IL8Mn3AQiYy5cACbCPiU+XACYFEmANLstPOgM4rwJGAevjn1yAbcRV0AywxSSggG1kdCTAHk0roHT0JYBGggS0X24VLwHZBbRHXoUOAe0RV0O3QVuMdxZoqSyUJkQCoDQHn7/8/CGbgLn4u4TsAj4zCXgpXgKSCZhJL2CFBEBpQiQAShMiAVCaEAmA0oRIAJQmRAKgNCESAKUJkQAoTYgEQGlCJABKEyIBUJoQCYDShEgAlCZkoICYS6skAErvIubyumECoq4vlAAovYOoa0wlAEp3E3eVsQRA6W4kIOxSewmA0p1E/rLF8NtgQgGxv24zWAA0cAiaAVC6CwkoAG3gUCQASneTVkDp6EtAKAkSAKUhWsVLgEEA2lu6rxf1SQK2R6PdxXu7kQ8WYB2L9pfv70cf8jaI/oYBNL8k6N8FaGZAPwTXgL0EuAusOg2cgE8v6o+P1piqgJdOAydwioDid8wvLqClYCWgVvxZEjwETOVLgFXARITCZ/wE1BWEXiaXXsB+5vIlQAJqiTQCagokYHsj12VZftIZsH0VIBawPv7JBdRTmgGmbV0SCSjwmpIA6+auSVoBpaMvAUUJEmDe5mVoFS8B2QW8ppMIqKd1G7Ru8nrYZgH9P4hsIQFQmhAJgNKESACUJkQCoDQhEgClCZEAKH0S/3+BBhkJL2Au/igJlxPgLSK0gFrxnhIkAEqfxFHFT+g2CKUJkQAoTYgEQGlCJABKE9IhgOlXr0tAnwAmBbAArA9AfCQASn+D9oKIjgRA6cDdYXuRACgtAWgzlPhIABLG2+HEp/s2mFBAT0Ok+HQKsI+KjmaAPSoBBeyjoyIBUJrwNDAKKB19CaCQIAHbkVbxEpBdwPbo6HQK2B51FXQbtEc5Z4H+exxKEyIBUNrIqsezYWlnX09oHw4QsOjybVrf2tsV3Ad3Aas+74ZVzv194X1wFrDo9F9d472UsMifxHEzwCSAbgZMPBXUKL6YH8zxd4ED8p4c9DnApy/8CL4AltzQWIi07CcAAAAASUVORK5CYII=',
        gameURL: 'https://mainnet-v5.rives.io/data/cartridges/a612d46cd43f',
        webview: false,
        webviewURI: 'https://rives-virtual-mobile-gamepad.vercel.app/doom-with-arrows.html',
        tiltGamepad: 'doom-smooth-turn.html',
        arrowGamepad: 'doom-with-arrows.html',
    },
    {
        id: '5',
        title: 'Pakboy',
        author: 'Eduardo Bart',
        imageUrl:
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOAAAAEIBAMAAAC0Y+WJAAAAHlBMVEVmM////////zP/uP//uJf/uEf/l0czmf//MzMAAABHXg75AAAEaElEQVR42u2csW7jOBCGuaVKI1isa3fq7qBq+zQur3CRF1gg5VVGSjcB3ekSJxHf9ijjCM8RvzMeghqdLvNBgaxZip8lc0iaWMup0wRV+hmEfeF9KTtvFIYCRmEowIQmXI7wtJX9JaH8PFWhNZrFCS0Pc2iMkqUFBNeXCx2BxihUyJVBsSRMtymBYnmcL4NiX0V4ur/fTipMjiS8j0wsTI7/jJA0fwqN82XmF36Zz1A/Laxrqy+UD09MGVxf+QCcKB2AFTHhpMI9gR6nyL/jefkRdEz3qkKQh7QCckyFJJ6XH+tAx3Q/pxDeQnCconx5eEtNqCAkr8Bxgi8/rxDn4eRCnIfuDKnARTJhKsWVD6mEK83D9AqU79N1jFOPJGwuZZLDhHrCPjvmWykWpn+bU4iHJ4eENC0alEaZkCZPYMbDwF1hw19hdh9wHgZCXgHVhoZtZKDWmYUmlE8T5xeCtCBL/kAonSamWHo9m1C+1CyIU2oLTWjC07ZceNp+JnQAKqRxJHQEKnSAUUj8tZe+ADMIEbWEuHJAU0cIm9XXFTJp4SJMWpQLg4BiIdOjvHY/ma6wipD4OmJUEHYjisLXs/CnnvCv1d3vqztFYf/t7rdv9YWnbYGwVh56Hwivq65bdbWFtAIf0Ww0wyg8Kgr9mf+z8LBax432NLEv7YKKMEF19fPw4NZxg4Jp8tA7H7eAhuFEgZBvNE0K9t0/NNenHgsVXrulImEGqmA4ej8cYQXgDconwuAWRV0oECJuEkbqCTH0K5dEmJ2LCJB0EoUX4nPxLcXIhZRlCtNSXWK3m1aYLznuIlMKP0bh0yX0NgofJhTmq6G7M5WEp61cSM+tIvxz9SNul9Afq+9xq5mHciGlgtD9iBsRuu9xm7LRuH3cyGfodnGbvZWaUJAWH0/7/QftaR52u7cHQVrIB+CLLimFA7D6FENfiKgldIiyCsrfoEh4lSUKwTqN+wQqXP56KaTCLTWhCfXTwvLQhCZcdh7KB2Cb0ygKEaGOEFcOq6kjhCVnEPa3fl377LkYt35dY/8DD9+jSM5d0m+5TWhCey4GxRqNCe25GPZcDBNG7Pf4tzT5W1OH/z2+LKn5zgEnfpVu62Wz2bRcPTWFmzmEbD30QRwVhO1VIXo+TQVhuCpMjrrCViQUTQER6QJxPZMIW064+M9w0/LCummx4dNCv6dZYl9KkQrz5kzjGFAG1kOF3JyTvobQMszcdRTi6QN+jZGcWyI0oQl7adOm66XSlIKJzyUvffeyTmM5vyE1oQkly5TyOP3TF1qjMeGi8pARSoctyXqpfKDF5QXrpdKphOA8udCEJmTSQr5eioF5iJGvl0IW9/xSE5rwtNX50xdaozEhxoROkVEYVJlBqE5QZk7hJkL3NfkFhC+jqE37yj5l4a/3QIXU2JJ9Nd5DJiTGlu7rMPjH8IiF0dTSfR38s38Pmlfo/fHZa36GBz88+6NiK/XrwasKBz+siVCjpxkOWDgd3s/aeSvzN2F6ML6HUT+FAAAAAElFTkSuQmCC',
        gameURL: 'https://mainnet-v5.rives.io/data/cartridges/bba40250eaeb',
        webview: false,
        webviewURI: 'https://rives-virtual-mobile-gamepad.vercel.app/doom-with-arrows.html',
        tiltGamepad: 'doom-smooth-turn.html',
        arrowGamepad: 'doom-with-arrows.html',
    },
];

export default function Home() {
    const pathname = usePathname();

    // State to track current window width
    const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);

    // Change orientation
    const changeOrientation = async () => {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };

    // Update window width on device rotation or resize
    useEffect(() => {
        const updateLayout = () => {
            setWindowWidth(Dimensions.get('window').width);
        };

        // Add event listener
        const subscription = Dimensions.addEventListener('change', updateLayout);

        // Initial orientation lock
        if (pathname === '/') {
            changeOrientation();
            if (Platform.OS === 'android') {
                NavigationBar.setVisibilityAsync('visible');
            }
        }

        // Cleanup listener
        return () => {
            subscription.remove();
        };
    }, [pathname]);

    return (
        <ParallaxScrollViewWithWallet
            headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
            headerImage={
                <Image
                    source={logo}
                    style={[styles.headerImage, { width: '120%', height: 260 }]} // Ajuste conforme necessário
                    resizeMode="cover"
                />
            }
        >
            <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
                <CustomGrid gameData={gameData} />
            </ScrollView>
        </ParallaxScrollViewWithWallet>
    );
}

const styles = StyleSheet.create({
    headerImage: {
        color: '#808080',
        bottom: -90,
        left: -35,
        position: 'absolute',
    },
    gridContainer: {
        paddingHorizontal: 10,
        paddingTop: 10,
    },
    cartridgeContainer: {
        flex: 1,
        margin: 5,
    },
    scrollViewContent: {
        flexGrow: 1,
    },
});

# Cartesi Hot Wallet

<div align="center">
  <img src="assets/images/cartesi-hot-wallet-logo.png" alt="Cartesi Hot Wallet Logo" width="200"/>
  <p>A mobile-first crypto wallet with Cartesi verification and gaming features</p>
</div>

## Overview

Cartesi Hot Wallet is a mobile cryptocurrency wallet application built on the Cartesi platform. It provides a secure, user-friendly way to manage crypto assets with a focus on verifiable frontends and a frictionless onboarding experience. The wallet also features integrated games powered by RIVES.

## Features

- **Simple Onboarding**: Create a wallet with just a password - no complex setup required
- **Secure by Design**: Wallet built with security best practices
- **Verifiable Frontend**: Frontend compiled using Cartesi for verifiability
- **Integrated Games**: Play RIVES games directly within the wallet
- **Leaderboard**: Compete with other users and track your game scores
- **Multiple Networks**: Support for various blockchain networks (currently Holesky testnet)
- **Web3 Integration**: Seamless interaction with decentralized applications

## Technologies

- React Native / Expo
- TypeScript
- Viem for Ethereum interactions
- Cartesi for verifiable computation
- RIVES for gaming integration
- Secure storage for wallet credentials

## Installation

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Setup

1. Clone the repository:

```bash
git clone https://github.com/your-username/cartesi-hot-wallet.git
cd cartesi-hot-wallet
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

4. Run on your preferred platform:

```bash
# For Android
npm run android

# For iOS
npm run ios

# For web
npm run web
```

## Usage

### Creating a Wallet

1. Launch the app
2. Set a strong password
3. Your wallet will be created automatically

### Managing Assets

- View your balance on the main screen
- Send tokens using the send feature
- Explore available dApps in the explore tab

### Playing Games

1. Navigate to the games section
2. Select a game from the available options
3. Compete for high scores on the leaderboard

## Project Structure

```
cartesi-hot-wallet/
├── app/                  # Main application code (Expo Router)
│   ├── (tabs)/           # Tab-based navigation screens
│   └── utils/            # Utility functions
├── assets/               # Static assets (images, fonts)
├── components/           # Reusable UI components
├── constants/            # Application constants
├── docs/                 # Project documentation
├── hooks/                # React hooks
├── src/                  # Core source code
│   ├── assets/           # Additional assets
│   ├── model/            # Data models
│   └── services/         # Service layer (API, wallet, etc.)
└── scripts/              # Utility scripts
```

## Development

### Key Concepts

- **Wallet Creation**: Wallets are created using a password-based seed that is securely stored
- **Verification**: The frontend is compiled using Cartesi for verifiability
- **Gaming Integration**: Games are integrated via the RIVES platform

### Testing

Run tests with:

```bash
npm test
```

## Roadmap

- Support for additional networks beyond Holesky testnet
- Enhanced gaming features and more game options
- Improved wallet management capabilities
- Integration with more dApps in the Cartesi ecosystem

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Cartesi team for their blockchain technology
- RIVES platform for gaming integration
- The open-source community for their invaluable contributions

import { HDKey } from '@scure/bip32';
import * as Sentry from '@sentry/react-native';
import * as SecureStore from 'expo-secure-store';
import {
    Account,
    bytesToHex,
    Chain,
    createPublicClient,
    createWalletClient,
    formatEther,
    GetLogsReturnType,
    hexToBytes,
    http,
    keccak256,
    PrivateKeyAccount,
    toBytes,
    Transport,
    WalletClient,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { baseSepolia } from 'viem/chains';

class WalletService {
    private _currentChain: Chain;

    constructor(chain: Chain = baseSepolia) {
        this._currentChain = chain;
    }

    get currentChain(): Chain {
        return this._currentChain;
    }

    setChain(chain: Chain): void {
        this._currentChain = chain;
    }

    getCurrentWalletAndEmail() {
        const seed = SecureStore.getItem('user_password');
        if (!seed) {
            return;
        }
        const email = seed.split('\t')[0];
        return { email, currentWallet: this.getCurrentWallet() };
    }

    getCurrentWallet() {
        const seed = SecureStore.getItem('user_password');
        if (!seed) {
            return;
        }
        return this.createWalletFromSeed(seed);
    }

    createWalletFromSeed(seed: string) {
        // Convert seed to bytes
        const seedBytes = toBytes(seed);

        // Apply Keccak-256 hash to the seed
        const hashedSeed = keccak256(seedBytes);
        console.log('Keccak-256 Hashed Seed:', hashedSeed);

        // Convert hashed seed to bytes
        const hashedSeedBytes = hexToBytes(hashedSeed);

        // Use hashed seed to generate an HD wallet
        const hdWallet = HDKey.fromMasterSeed(hashedSeedBytes);
        const child = hdWallet.derive("m/44'/60'/0'/0/0"); // Standard Ethereum derivation path

        // Convert the private key to hex
        const privateKey = child.privateKey ? bytesToHex(child.privateKey) : null;

        if (!privateKey) {
            throw new Error('Failed to derive private key');
        }

        console.log('Derived Private Key:', privateKey);
        const account: PrivateKeyAccount = privateKeyToAccount(privateKey);

        const client = createWalletClient({
            account,
            chain: this._currentChain,
            transport: http(),
        });
        return client;
    }

    setCurrentWallet(seed: string): WalletClient<Transport, Chain, Account> {
        SecureStore.setItemAsync('user_password', seed).catch(e => console.error(e));

        return this.createWalletFromSeed(seed);
    }

    unsetCurrentWallet(): void {
        SecureStore.deleteItemAsync('user_password').catch(e => console.error('Error during logout:', e));
    }

    async getWalletBalance(address: `0x${string}`) {
        const client = createPublicClient({
            chain: this._currentChain,
            transport: http(),
        });

        try {
            const balanceWei = await client.getBalance({
                address,
            });
            const balanceEther = formatEther(balanceWei);
            return balanceEther;
        } catch (e) {
            console.error('Error fetching balance:', e);
            Sentry.captureException(e, {
                // user: { id: '123', email: 'test1@example.com' }, // context info about user
                tags: { feature: 'getWalletBalance' },
                extra: { debugData: '@walletService.ts - Error getting wallet balance' },
                // fingerprint: ['custom-fingerprint'],
            });
            throw e;
        }
    }

    async getAccountLogs(address: `0x${string}`): Promise<GetLogsReturnType> {
        const client = createPublicClient({
            chain: this._currentChain,
            transport: http(),
        });

        try {
            // TODO: https://viem.sh/docs/actions/public/getLogs.html#scoping
            const logs = await client.getLogs({
                address,
            });
            return logs;
        } catch (e) {
            console.error('Error getting accoung logs:', e);
            Sentry.captureException(e, {
                // user: { id: '123', email: 'test1@example.com' }, // context info about user
                tags: { feature: 'getAccountLogs' },
                extra: { debugData: '@walletService.ts - Error getting account logs' },
                // fingerprint: ['custom-fingerprint'],
            });
            throw e;
        }
    }
}

const walletService = new WalletService();
export { walletService };

import { 
    Account, 
    Chain, 
    createWalletClient, 
    http, 
    PrivateKeyAccount, 
    toBytes, 
    Transport, 
    WalletClient 
} from "viem";
import { holesky } from "viem/chains";
import { HDKey } from '@scure/bip32';
import { keccak256, hexToBytes, bytesToHex } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

class WalletService {
    private cachedWallet: Record<string, WalletClient<Transport, Chain, Account>> = {};

    getWalletClient(seedHex: string): WalletClient<Transport, Chain, Account> {
        const cached = this.cachedWallet[seedHex];
        if (cached) {
            return cached;
        }

        // Convert seed to bytes
        const seedBytes = toBytes(seedHex);

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
            throw new Error("Failed to derive private key");
        }

        console.log('Derived Private Key:', privateKey);
        const account: PrivateKeyAccount = privateKeyToAccount(privateKey);

        const client = createWalletClient({
            account,
            chain: holesky,
            transport: http(),
        });

        this.cachedWallet[seedHex] = client;
        return client;
    }
}

const walletService = new WalletService();

export { walletService };

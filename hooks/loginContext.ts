import { createContext } from "react";
import { WalletClient } from "viem";

export interface LoginContextProps {
    address: string;
    setAddress: (v: string) => void;
    client: WalletClient | null;
    setClient: (client: WalletClient | null) => void;
    logout: () => void;
}

const LoginContext = createContext<LoginContextProps>({
    address: '',
    setAddress: (_v: string) => {},
    client: null,
    setClient: (_client: WalletClient | null) => {},
    logout: () => {},
});

export default LoginContext;

declare global {
    interface Window extends Window {
        z3us: {
            v1: {
                hasWallet: () => Promise<boolean>
                isConnected: () => Promise<boolean>
                connect: () => Promise<string>
                disconnect: () => Promise<void>
                sign: (challenge: string) => Promise<string>
                submitTransaction: (payload: { actions: any[] }) => Promise<any>
                encrypt: (message: string, fromAddress: string, toAddress: string) => Promise<string>
                decrypt: (message: string, fromAddress: string) => Promise<string>
                addresses: () => Promise<string[]>
                balances: () => Promise<unknown>
                stakes: () => Promise<unknown>
                unstakes: () => Promise<unknown>
                /**
                 * @deprecated Use submitTransaction() instead
                 */
                sendTransaction: (payload: { symbol: string; fromAddress: string; transaction: any }) => Promise<any>
            }
        }
    }
}
export {}
